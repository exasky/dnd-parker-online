import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, inject, OnInit, viewChild, ViewContainerRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { AdventureWebsocketService } from "../../../common/service/ws/adventure.websocket.service";
import { Adventure, Board, LayerElement, LayerElementType, LayerItem } from "../../model/adventure";
import { LayerGridsterItem } from "../../model/layer-gridster-item";
import { AdventureService } from "../../service/adventure.service";
import { ContextMenuComponent } from "../adventure/context-menu/context-menu.component";
import { EntityTooltipComponent } from "./tooltip.component";

@Component({
  selector: "app-adventure3d-scene",
  template: `
    <div class="scene-container" #sceneContainer></div>
    <app-context-menu #contextMenu />
    @if (hoveredItem) {
      <app-entity-tooltip [item]="hoveredItem" [position]="tooltipPosition" />
    }
  `,
  styles: [
    `
      :host {
        width: 100%;
        height: 100%;
        position: relative;
      }
    `,
    `
      .scene-container {
        width: 100%;
        height: 100%;
      }
    `,
  ],
  imports: [CommonModule, ContextMenuComponent, EntityTooltipComponent],
})
export class Adventure3dComponent implements OnInit, AfterViewInit {
  //region backend
  route = inject(ActivatedRoute);
  adventureService = inject(AdventureService);
  adventureWS = inject(AdventureWebsocketService);

  adventure: Adventure;
  //endregion

  private host = inject(ViewContainerRef);
  sceneContainerRef = viewChild<ElementRef>("sceneContainer");

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private canvas!: HTMLCanvasElement;
  private controls!: OrbitControls;
  private raycaster!: THREE.Raycaster;
  private mouse: THREE.Vector2;

  private intersectedObjects: THREE.Object3D[] = []; // Pour les entités cliquables
  private hoveredObject: THREE.Object3D | null = null;
  hoveredItem?: LayerItem;
  tooltipPosition = { top: "0px", left: "0px" };

  // context
  contextMenu = viewChild<ContextMenuComponent>("contextMenu");
  contextMenuVisible = false;
  contextMenuPosition = { top: "0px", left: "0px" };
  contextMenuActions: { label: string; handler: () => void }[] = [];

  ngOnInit(): void {
    const adventureId = this.route.snapshot.paramMap.get("id")!;
    this.adventureService.getAdventure(adventureId).subscribe((adventure) => {
      this.adventure = adventure;

      this.initScene();
      this.startRenderingLoop();
    });
  }

  ngAfterViewInit(): void {}

  private initScene(): void {
    const container = this.sceneContainerRef().nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111111); // dark theme

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(10, 10, 10);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.canvas = this.renderer.domElement;
    container.appendChild(this.canvas);

    // Controls (debug uniquement)
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    this.scene.add(directionalLight);

    const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
    this.scene.add(lightHelper);

    // Grid Helper
    // const gridHelper = new THREE.GridHelper(20, 20);
    // this.scene.add(gridHelper);

    this.camera.position.z = 5;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.canvas.addEventListener("click", this.onCanvasClick.bind(this));
    this.renderer.domElement.addEventListener("pointermove", this.onCanvasPointerMove.bind(this));
    this.renderer.domElement.addEventListener("contextmenu", this.onCanvasRightClick.bind(this));

    // this.createBoard();
    this.renderAdventureBoards(this.adventure);
    this.renderEntities(this.adventure);
  }

  // #region RENDER ADVENTURE BOARDS
  private renderAdventureBoards(adventure: Adventure): void {
    const tileSize = 11; // Chaque board fait 11x11

    const rowSize = this.adventure.boards.length;
    const colSize = this.adventure.boards.map((row: Board[]) => row.length).sort()[0];

    // Grid Helper
    const gridHelper = new THREE.GridHelper(11, 20);
    gridHelper.scale.set(1, 1, 1);
    this.scene.add(gridHelper);

    const loader = new THREE.TextureLoader();

    const rows = adventure.boards.length;
    const cols = adventure.boards[0].length;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!adventure.boards[row][col]) continue;
        const board = adventure.boards[row][col];
        const texturePath = `assets/board/${board.boardNumber}.JPG`;

        const texture = loader.load(texturePath);
        const material = new THREE.MeshStandardMaterial({ map: texture });
        const geometry = new THREE.PlaneGeometry(tileSize, tileSize);

        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2;

        // Rotation autour de Z
        const rotationZ = THREE.MathUtils.degToRad(board.rotation || 0);
        mesh.rotation.z = rotationZ;

        // Position du board (centré sur (0,0))
        const offsetX = col * tileSize + tileSize / 2;
        const offsetZ = row * tileSize + tileSize / 2;

        mesh.position.set(offsetX, 0, offsetZ);

        this.scene.add(mesh);
      }
    }
  }
  // #endregion

  // #region RENDER ENTITIES

  private renderEntities(adventure: Adventure): void {
    adventure.traps.forEach((trap) => {
      this.addLayerItem(trap);
    });
    adventure.characters.forEach((trap) => {
      this.addLayerItem(trap);
    });
    adventure.monsters.forEach((trap) => {
      this.addLayerItem(trap);
    });
    adventure.otherItems.forEach((trap) => {
      this.addLayerItem(trap);
    });
    adventure.chests.forEach((trap) => {
      this.addLayerItem(trap);
    });
    adventure.doors.forEach((trap) => {
      this.addLayerItem(trap);
    });
  }

  private addLayerItem(item: LayerItem): void {
    const textureLoader = new THREE.TextureLoader();
    const imagePath = this.getImagePathForItem(item.element);
    textureLoader.load(imagePath, (texture) => {
      const geometry = new THREE.PlaneGeometry(item.element.colSize, item.element.rowSize);
      const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
      const plane = new THREE.Mesh(geometry, material);

      plane.rotation.x = -Math.PI / 2; // à plat sur le sol

      const centerX = item.positionX + item.element.colSize / 2;
      const centerZ = item.positionY + item.element.rowSize / 2;
      plane.position.set(centerX, 0.01, centerZ); // Légèrement au-dessus du plateau

      plane.userData = { layerItem: item }; // Pour l'interaction
      this.intersectedObjects.push(plane);

      this.scene.add(plane);
    });
  }

  private getImagePathForItem(element: LayerElement): string {
    switch (element.type) {
      case LayerElementType.CHEST:
        return `assets/item/${element.name}`;
      case LayerElementType.MONSTER:
        return `assets/monster/${element.name}-token.jpg`;
      case LayerElementType.CHARACTER:
        return `assets/character/${element.name}-token.jpg`;
      case LayerElementType.TRAP:
        return `assets/item/${element.name}-activated.jpg`;
      case LayerElementType.DOOR:
        return `assets/item/door-${element.name}-closed.jpg`;
      default:
        return `assets/item/${element.name}`; // fallback
    }
  }
  // #endregion

  // #region Grid interactions
  onCanvasClick(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();

    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.intersectedObjects, true);

    if (intersects.length > 0) {
      const clicked = intersects[0].object;

      const userData = clicked.userData as { layerItem: LayerItem };
      if (userData?.layerItem) {
        this.handleEntityClick(userData.layerItem);
      }
    }
  }

  handleEntityClick(item: LayerItem): void {
    switch (item.element.type) {
      case LayerElementType.CHEST:
        console.log("Coffre cliqué :", item.element.name);
        // → lancer animation ouverture
        break;
      case LayerElementType.MONSTER:
        console.log("Monstre ciblé :", item.element.name);
        // → afficher PV, options d'attaque, etc.
        break;
      case LayerElementType.TRAP:
        console.log("Piège détecté !");
        // → afficher / déclencher si visible
        break;
      default:
        console.log("Élément cliqué :", item);
    }
  }

  onCanvasPointerMove(event: PointerEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.intersectedObjects, true);

    if (intersects.length > 0) {
      const object = intersects[0].object;

      if (this.hoveredObject !== object) {
        this.clearHoverEffect();

        this.hoveredObject = object;
        this.applyHoverEffect(object);

        const layerItem = object.userData["layerItem"] as LayerItem;
        if (this.tooltipEnabled(layerItem.element)) {
          this.hoveredItem = layerItem;
          this.tooltipPosition = {
            top: `${event.clientY + 10}px`,
            left: `${event.clientX + 10}px`,
          };
        }
      }
    } else {
      this.clearHoverEffect();
      this.hoveredObject = null;
      this.hoveredItem = null;
    }
  }

  tooltipEnabled(item: LayerElement): boolean {
    return item.id && [LayerElementType.CHARACTER, LayerElementType.MONSTER].indexOf(item.type) !== -1;
  }

  applyHoverEffect(object: THREE.Object3D): void {
    const material = (object as any).material;
    if (material && "emissive" in material) {
      material.emissive.setHex(0x444444);
    } else if (material && "color" in material) {
      material.color.setHex(0xffffaa);
    }
  }

  clearHoverEffect(): void {
    if (this.hoveredObject) {
      const material = (this.hoveredObject as any).material;
      if (material && "emissive" in material) {
        material.emissive.setHex(0x000000);
      } else if (material && "color" in material) {
        material.color.setHex(0xffffff);
      }
    }
  }

  onCanvasRightClick(event: MouseEvent): void {
    event.preventDefault();

    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.intersectedObjects, true);

    if (intersects.length > 0) {
      const obj = intersects[0].object;
      const item = obj.userData["layerItem"] as LayerItem;

      this.contextMenuPosition = {
        top: `${event.clientY}px`,
        left: `${event.clientX}px`,
      };

      // TODO item as LayerGridsterItem ? Or refacto contextMenu open ?
      this.contextMenu().openMenu(event, item as any as LayerGridsterItem);
    }
  }
  // #endregion

  private startRenderingLoop(): void {
    const animate = () => {
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    this.renderer.setAnimationLoop(animate);
  }
}
