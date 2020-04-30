import {Component, HostBinding, Input} from "@angular/core";
import {LayerElement, LayerElementType} from "../../../model/adventure";
import {StringUtils} from "../../../../common/utils/string-utils";
import {ItemDisplayer, ItemNode} from "../../../../common/component/item.displayer";

@Component({
  selector: 'app-adventure-item-displayer',
  templateUrl: './adventure-item-displayer.component.html',
  styleUrls: ['./adventure-item-displayer.component.scss']
})
export class AdventureItemDisplayerComponent extends ItemDisplayer<LayerElement> {
  @HostBinding('class') cssClass = 'flex-grow d-flex'

  layerElementType = LayerElementType;

  @Input()
  set layerElements(layerElements: LayerElement[]) {
    this.elements = layerElements;
    if (layerElements) this.filterDataSource('');
  }

  protected filterDataSource(filterText: string) {
    const data: ItemNode[] = [];
    const splitFilter = filterText.split(' ');
    this.elements.forEach(layerElement => {
      if (StringUtils.isFilter(splitFilter, layerElement.name.split('_'))) {
        const name = layerElement.type !== LayerElementType.MONSTER && layerElement.type !== LayerElementType.CHARACTER
          ? 'ITEM'
          : layerElement.type;

        let groupNode = data.find(value => value.name === name);
        if (!groupNode) {
          groupNode = {name: name, children: []};
          data.push(groupNode);
        }
        groupNode.children.push({...layerElement});
      }
    });
    this.dataSource.data = data;
  }

  dragStartHandler(ev, layerElement: LayerElement) {
    ev.dataTransfer.setData('text/plain', layerElement.id + '');
    ev.dataTransfer.dropEffect = 'copy';
  }
}
