import {Component, HostBinding, Input} from "@angular/core";
import {CharacterEquipment} from "../../model/character";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material/tree";
import {FlatTreeControl} from "@angular/cdk/tree";

/**
 * Food adventureId with nested structure.
 * Each node has a name and an optional list of children.
 */
interface ItemNode {
  name: string;
  children?: ItemNode[];
}

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-character-item-displayer',
  templateUrl: './character-item-displayer.component.html'
})
export class CharacterItemDisplayerComponent {
  @HostBinding('class') cssClass = 'd-flex flex-column'

  _characterItems: CharacterEquipment[];
  @Input()
  set characterItems(characterItems: CharacterEquipment[]) {
    this._characterItems = characterItems;
    this.filterDataSource('');
  }

  private _transformer = (node: ItemNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      item: node
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  private filterDataSource(filterText: string) {
    const data: ItemNode[] = [];
    this._characterItems.forEach(characterItem => {
      if (characterItem.name.indexOf(filterText) !== -1) {
        let groupNode = data.find(value => value.name === characterItem.type);
        if (!groupNode) {
          groupNode = {name: characterItem.type, children: []};
          data.push(groupNode);
        }
        groupNode.children.push(characterItem);
      }
    });
    this.dataSource.data = data;
  }

  filterChanged(filterText: string) {
    this.filterDataSource(filterText);
    if (filterText) {
      this.treeControl.expandAll();
    } else {
      this.treeControl.collapseAll();
    }
  }

  dragStartHandler(ev: DragEvent, item: CharacterEquipment) {
    ev.dataTransfer.setData('text/plain', item.id + '');
    ev.dataTransfer.dropEffect = 'copy';
  }
}
