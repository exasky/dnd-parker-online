import {Component, Inject} from "@angular/core";
import {GmService} from "../../../service/gm.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Character} from "../../../model/character";
import {AlertMessageType} from "../../../model/alert-message";

@Component({
  selector: 'app-alert-message-dialog',
  templateUrl: './alert-message-dialog.component.html',
  styleUrls: ['./alert-message-dialog.component.scss']
})
export class AlertMessageDialogComponent {
  AlertMessageType = AlertMessageType;
  Object=Object;

  selectedCharacter: Character;
  message: string;
  type: AlertMessageType = AlertMessageType.SUCCESS;

  constructor(private gmService: GmService,
              @Inject(MAT_DIALOG_DATA) public data: { adventureId: number, characters: Character[] }) {
  }

  sendAlert() {
    this.gmService.sendAlert(this.data.adventureId, {
      characterId: this.selectedCharacter?.id,
      message: this.message,
      type: this.type
    })
  }
}
