import {Component, HostBinding, Input} from "@angular/core";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material/tree";
import {FlatTreeControl} from "@angular/cdk/tree";
import {LayerElement, LayerElementType} from "../../../model/adventure";

/**
 * Food data with nested structure.
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
  selector: 'app-adventure-item-displayer',
  templateUrl: './adventure-item-displayer.component.html',
  styleUrls: ['./adventure-item-displayer.component.scss']
})
export class AdventureItemDisplayerComponent {
  @HostBinding('class') cssClass = 'flex-grow d-flex'

  layerElementType = LayerElementType;

  _layerElements: LayerElement[];
  @Input()
  set layerElements(layerElements: LayerElement[]) {
    this._layerElements = layerElements;
    if (layerElements) this.filterDataSource('');
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
    this._layerElements.forEach(layerElement => {
      if (layerElement.name.indexOf(filterText) !== -1) {
        let name;
        if (layerElement.type !== LayerElementType.MONSTER && layerElement.type !== LayerElementType.CHARACTER) {
          name = 'Item';
        } else {
          name = layerElement.type;
        }
        let groupNode = data.find(value => value.name === name);
        if (!groupNode) {
          groupNode = {name: name, children: []};
          data.push(groupNode);
        }
        groupNode.children.push({...layerElement, name: layerElement.name});
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

  dragStartHandler(ev, layerElement: LayerElement) {
    ev.dataTransfer.setData('text/plain', layerElement.id + '');
    ev.dataTransfer.dropEffect = 'copy';
  }
}
