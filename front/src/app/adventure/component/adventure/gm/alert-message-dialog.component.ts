import {Component, Inject} from "@angular/core";
import {GmService} from "../../../service/gm.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Character} from "../../../model/character";
import {AlertMessageType} from "../../../model/alert-message";
import {MatSelectChange} from "@angular/material/select";

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
  type: AlertMessageType;

  constructor(private gmService: GmService,
              @Inject(MAT_DIALOG_DATA) public data: { adventureId: number, characters: Character[] }) {
  }

  selectCharacter(event: MatSelectChange) {
    this.selectedCharacter = event.value;
  }

  sendAlert() {
    this.gmService.sendAlert(this.data.adventureId, {
      characterId: this.selectedCharacter?.id,
      message: this.message,
      type: this.type
    })
  }
}
