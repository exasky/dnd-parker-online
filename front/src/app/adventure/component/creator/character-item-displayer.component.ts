import { DragDropModule } from "@angular/cdk/drag-drop";
import { Component, HostBinding, Input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTreeModule } from "@angular/material/tree";
import { TranslateModule } from "@ngx-translate/core";
import { ItemDisplayer, ItemNode } from "../../../common/component/item.displayer";
import { GetCardImagePipe } from "../../../common/utils/card-utils";
import { StringUtils } from "../../../common/utils/string-utils";
import { CharacterEquipment } from "../../model/character";

@Component({
  selector: "app-character-item-displayer",
  templateUrl: "./character-item-displayer.component.html",
  imports: [
    MatFormFieldModule,
    TranslateModule,
    MatTreeModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    DragDropModule,
    GetCardImagePipe,
  ],
})
export class CharacterItemDisplayerComponent extends ItemDisplayer<CharacterEquipment> {
  @HostBinding("class") cssClass = "d-flex flex-column";

  @Input()
  set characterItems(characterItems: CharacterEquipment[]) {
    this.elements.set(characterItems);
  }

  protected override filterDataSource(elements: CharacterEquipment[], filterText: string): ItemNode[] {
    const data: ItemNode[] = [];
    const splitFilter = filterText.split(" ");
    elements.forEach((characterItem) => {
      if (StringUtils.isFilter(splitFilter, characterItem.name.split("_"))) {
        let typeNode = data.find((value) => value.name === characterItem.type);
        if (!typeNode) {
          typeNode = { name: characterItem.type, children: [] };
          data.push(typeNode);
        }
        if (characterItem.level) {
          // Card case
          let levelNode = typeNode.children!.find((value) => value.name === characterItem.level + "");
          if (!levelNode) {
            levelNode = { name: characterItem.level + "", children: [] };
            typeNode.children!.push(levelNode);
          }
          levelNode.children!.push(characterItem);
        } else {
          // Item case
          typeNode.children!.push(characterItem);
        }
      }
    });
    data.forEach((typeNode) => typeNode.children!.sort((a, b) => (a.name < b.name ? -1 : 1)));
    data.sort((a, b) => (a.name < b.name ? -1 : 1));
    return data;
  }

  dragStartHandler(ev: DragEvent, item: CharacterEquipment) {
    ev.dataTransfer!.setData("text/plain", item.id + "");
    ev.dataTransfer!.dropEffect = "copy";
  }
}
