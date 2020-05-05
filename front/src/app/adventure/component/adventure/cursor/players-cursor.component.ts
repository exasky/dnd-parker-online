import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from "@angular/core";
import {MouseMove} from "../../../model/adventure-message";
import {CharacterLayerGridsterItem} from "../../../model/layer-gridster-item";

@Component({
  selector: 'app-players-cursor',
  templateUrl: './players-cursor.component.html',
  styleUrls: ['./players-cursor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayersCursorComponent {

  @Input()
  characters: CharacterLayerGridsterItem[];

  enhancedCursors: MouseMove[];

  @Input()
  set playerCursors(playerCursors: MouseMove[]) {
    console.log(playerCursors);
    this.enhancedCursors = playerCursors;
    this.enhancedCursors.forEach(cursor => {
      const charNames = this.getCharacterNamesFromId(cursor.userId);
      cursor['char'] = charNames[0];
      cursor['chars'] = charNames;
    })
    this.cdr.detectChanges();
  }

  constructor(private cdr: ChangeDetectorRef) {
  }

  private getCharacterNamesFromId(userId) {
    const characters = this.characters.filter(char => char.id && char.character.userId === userId);
    return characters.length !== 0 ? characters.map(char => char.name) : ['MJ'];
  }
}
