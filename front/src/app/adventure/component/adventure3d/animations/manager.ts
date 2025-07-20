import { Injectable } from "@angular/core";
import * as THREE from "three";

@Injectable({
  providedIn: "root",
})
export class AnimationManager {
  private _activeAnimations: Array<(any?) => boolean> = [];

  addAnimation(animation: () => boolean) {
    this._activeAnimations.push(animation);
  }

  runAnimations(time: number) {
    this._activeAnimations = this._activeAnimations.filter((fn) => fn(time));
  }

  animateMove(mesh: THREE.Object3D, to: THREE.Vector3, duration = 300) {
    const from = mesh.position.clone();
    const start = performance.now();

    this._activeAnimations.push((time: number) => {
      const t = Math.min((time - start) / duration, 1);
      mesh.position.lerpVectors(from, to, t);
      return t < 1;
    });
  }

  playActionAnimation(scene: THREE.Scene, x: number, y: number, type: "ATTACK" | "CHEST_OPEN" | "TRAP_TRIGGER") {
    const worldX = x + 0.5;
    const worldY = -(y + 0.5);

    const group = new THREE.Group();
    group.position.set(worldX, 0.01, worldY); // Léger décalage en Y pour pas clipper le plateau
    scene.add(group);

    switch (type) {
      case "ATTACK":
        this.playAttackAnimation(scene, group);
        break;
      case "CHEST_OPEN":
        this.playChestOpenAnimation(scene, group);
        break;
      case "TRAP_TRIGGER":
        this.playTrapAnimation(scene, group);
        break;
    }

    // Optionnel : retirer l'animation après un délai
    setTimeout(() => {
      scene.remove(group);
    }, 1000);
  }

  private playAttackAnimation(scene: THREE.Scene, parent: THREE.Group) {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    parent.add(mesh);

    this.playSound("attack");

    let opacity = 0.6;
    this._activeAnimations.push(() => {
      opacity -= 0.03;
      material.opacity = opacity;
      if (opacity <= 0) {
        parent.remove(mesh);
        scene.remove(parent);
        return false;
      }
      return true;
    });
  }

  private playChestOpenAnimation(scene: THREE.Scene, parent: THREE.Group) {
    const geometry = new THREE.RingGeometry(0.2, 0.5, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(geometry, material);
    ring.rotation.x = -Math.PI / 2;
    parent.add(ring);

    let scale = 1;
    this._activeAnimations.push(() => {
      scale += 0.05;
      ring.scale.set(scale, scale, scale);
      material.opacity -= 0.04;
      if (material.opacity <= 0) {
        parent.remove(ring);
        scene.remove(parent);
        return false;
      }
      return true;
    });
  }

  private playTrapAnimation(scene: THREE.Scene, parent: THREE.Group) {
    const geometry = new THREE.CircleGeometry(0.5, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0x8b0000, transparent: true, opacity: 0.6 });
    const circle = new THREE.Mesh(geometry, material);
    circle.rotation.x = -Math.PI / 2;
    parent.add(circle);

    let opacity = 0.6;
    this._activeAnimations.push(() => {
      opacity -= 0.03;
      material.opacity = opacity;
      if (material.opacity <= 0) {
        parent.remove(circle);
        scene.remove(parent);
        return false;
      }
      return true;
    });
  }

  private playSound(name: "attack" | "chest" | "trap") {
    let audioFile = () => {
      switch (name) {
        case "attack":
          return `/assets/sound/melee_sword_0.mp3`;
        case "chest":
          return `/assets/sound/chest_open_0.mp3`;
        case "trap":
          return `/assets/sound/monster_breath.mp3`;
      }
    };
    const audio = new Audio(audioFile());
    audio.play();
  }
}
