import { FlatTreeControl } from "@angular/cdk/tree";
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material/tree";
import { ItemType } from "../../adventure/model/character";

export interface ItemNode {
  name: string;
  children?: ItemNode[];
}

interface ItemFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

export abstract class ItemDisplayer<T extends { name: string }> {
  ItemType = ItemType;

  protected elements: T[];

  private _transformer = (node: ItemNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      item: node,
    };
  };

  treeControl = new FlatTreeControl<ItemFlatNode>(
    (node) => node.level,
    (node) => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ItemFlatNode) => node.expandable;

  protected abstract filterDataSource(filterText: string);

  filterChanged(filterText: string) {
    this.filterDataSource(filterText);
    if (filterText) {
      this.treeControl.expandAll();
    } else {
      this.treeControl.collapseAll();
    }
  }
}
