import {ChangeDetectorRef, Component, Input} from "@angular/core";
import {Initiative} from "../../../model/adventure";
import {CharacterLayerGridsterItem} from "../../../model/layer-gridster-item";

@Component({
  selector: 'app-top-action-panel-left',
  templateUrl: './top-action-panel-left.component.html',
  styleUrls: ['./top-action-panel-left.component.scss']
})
export class TopActionPanelLeftComponent {
  sortedCharacterItems: CharacterLayerGridsterItem[] = [];

  @Input()
  set characterItems(characterItems: CharacterLayerGridsterItem[]) {
    this.sortCharacters(characterItems);
  }

  @Input()
  currentInitiative: Initiative;

  constructor(private cdr: ChangeDetectorRef) {
  }

  private sortCharacters(characterItems: CharacterLayerGridsterItem[]) {
    this.sortedCharacterItems = characterItems.filter(c => c.id !== null);
    this.sortedCharacterItems.sort((c1, c2) => c1.character.name < c2.character.name ? -1 : 1);
    this.cdr.detectChanges();
  }
}
