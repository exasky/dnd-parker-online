import {Component, Input} from "@angular/core";
import {GmService} from "../../../service/gm.service";
import {Adventure} from "../../../model/adventure";

@Component({
  selector: 'app-action-panel',
  templateUrl: './action-panel.component.html'
})
export class ActionPanelComponent {
  @Input()
  adventure: Adventure;

  constructor(private gmService: GmService) {
  }

  drawCard() {
    // Do nothing as get card from websocket
    this.gmService.drawCard(this.adventure.id).subscribe(() => {});
  }
}
