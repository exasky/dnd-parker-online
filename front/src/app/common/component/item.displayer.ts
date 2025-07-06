import { computed, Directive, signal, viewChild } from "@angular/core";
import { MatTree } from "@angular/material/tree";
import { ItemType } from "../../adventure/model/character";

export interface ItemNode {
  name: string;
  children?: ItemNode[];
}

@Directive()
export abstract class ItemDisplayer<T extends { name: string }> {
  ItemType = ItemType;

  protected elements = signal<T[]>([]);
  filterText = signal<string>("");
  datasource = computed(() => this.filterDataSource(this.elements(), this.filterText()));
  matTree = viewChild<MatTree<T>>(MatTree<T>);

  childrenAccessor = (node: ItemNode) => node.children ?? [];
  hasChild = (_: number, node: ItemNode) => !!node.children && node.children.length > 0;

  protected abstract filterDataSource(elements: T[], filterText: string): ItemNode[];

  filterChanged(filterText: string) {
    this.filterText.set(filterText);
    // Run after datasource computed()
    setTimeout(() => (this.filterText() ? this.matTree().expandAll() : this.matTree().collapseAll()));
  }
}
