import {Component, Inject} from "@angular/core";
import {GmService} from "../../../service/gm.service";
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {Character} from "../../../model/character";
import {AlertMessageType} from "../../../model/alert-message";
import { MatFormFieldModule } from "@angular/material/form-field";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";

@Component({
  selector: 'app-alert-message-dialog',
  templateUrl: './alert-message-dialog.component.html',
  styleUrls: ['./alert-message-dialog.component.scss'],
  imports: [MatFormFieldModule, TranslateModule, FormsModule, MatSelectModule, MatDialogModule]
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
