import { ChangeDetectionStrategy, Component, effect, Host, HostBinding, input } from "@angular/core";
import { LayerElementType, LayerItem } from "../../model/adventure";
import { CharacterTooltipDisplayerComponent } from "../adventure/character/character-tooltip-displayer.component";
import { Character } from "../../model/character";
import { CommonModule } from "@angular/common";
import { GetMonsterImagePipe } from "../../../common/utils/card-utils";
import { trigger, transition, style, animate } from "@angular/animations";

@Component({
  selector: "app-entity-tooltip",
  template: `
    <div @fadeInOut>
      @switch (item().element.type) {
        @case (LayerElementType.CHARACTER) {
          <app-character-tooltip-displayer
            [character]="item()['character']"
            [ngStyle]="{ height: getCharacterTooltipHeight(item()['character']) + 'px' }"
          />
        }
        @case (LayerElementType.MONSTER) {
          <img width="300" [src]="item()['monster'] | getMonsterImage: true" />
        }
      }
    </div>
  `,
  styles: [
    `
      :host {
        position: absolute;
        z-index: 1000;
        pointer-events: none;
        background-color: rgba(0, 0, 0, 0.7);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CharacterTooltipDisplayerComponent, CommonModule, GetMonsterImagePipe],
  animations: [
    trigger("fadeInOut", [
      transition(":enter", [
        style({ opacity: 0, transform: "scale(0.95)" }),
        animate("150ms ease-out", style({ opacity: 1, transform: "scale(1)" })),
      ]),
      transition(":leave", [animate("100ms ease-in", style({ opacity: 0, transform: "scale(0.95)" }))]),
    ]),
  ],
})
export class EntityTooltipComponent {
  item = input.required<LayerItem>();
  position = input<{ top: string; left: string }>();

  @HostBinding("style.top") styleTop;
  @HostBinding("style.left") styleLeft;

  LayerElementType = LayerElementType;

  constructor() {
    effect(() => {
      this.styleTop = this.position().top;
      this.styleLeft = this.position().left;
    });
  }

  getCharacterTooltipHeight(character: Character) {
    return Math.min(2, Math.max(character.equippedItems.length, character.backpackItems.length)) * 230;
  }
}
