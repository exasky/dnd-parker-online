import {Component, HostBinding, Input} from "@angular/core";
import {GmService} from "../../../service/gm.service";
import {Adventure} from "../../../model/adventure";
import {MatDialog} from "@angular/material/dialog";
import {DiceService} from "../../../service/dice.service";
import {AuthService} from "../../../../login/auth.service";

@Component({
  selector: 'app-action-panel',
  templateUrl: './action-panel.component.html'
})
export class ActionPanelComponent {
  @HostBinding('class') cssClasses = "flex-grow d-flex flex-column";

  @Input()
  disableActions: boolean = false;

  @Input()
  adventure: Adventure;

  constructor(private gmService: GmService,
              private dialog: MatDialog,
              private diceService: DiceService,
              public authService: AuthService) {
  }

  drawCard() {
    if (!this.disableActions) {
      // Do nothing as get card from websocket
      this.gmService.drawCard(this.adventure.id).subscribe(() => {
      });
    }
  }

  rollDices() {
    if (!this.disableActions) {
      this.diceService.openDiceDialog();
    }
  }

  prevAdventure() {
    this.gmService.previousAdventure(this.adventure.id);
  }

  nextAdventure() {
    this.gmService.nextAdventure(this.adventure.id);
  }
}
