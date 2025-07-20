import { Injectable } from "@angular/core";
import * as THREE from "three";
import { LayerItem } from "../../model/adventure";

@Injectable({
  providedIn: "root",
})
export class LayerMeshesState {
  private layerMeshes = new Map<any, THREE.Mesh>(); // Pour stocker les entités
  private layerItems = new Map<any, LayerItem>(); // Pour stocker les entités

  addLayerMesh(item: LayerItem, mesh: THREE.Mesh) {
    this.layerMeshes.set(this.getLayerMeshKey(item), mesh);
    this.layerItems.set(this.getLayerMeshKey(item), item);
  }

  first(): LayerItem {
    return this.layerItems.values().next().value;
  }

  getLayerMesh(item: LayerItem): THREE.Mesh {
    return this.layerMeshes.get(this.getLayerMeshKey(item));
  }

  private getLayerMeshKey(item: LayerItem) {
    return `${item.id}-${item.element.id}`;
  }
}
