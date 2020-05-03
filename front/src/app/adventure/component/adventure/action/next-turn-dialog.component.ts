import {AuthService} from "../../../../login/auth.service";
import {Component, Inject} from "@angular/core";
import {AdventureService} from "../../../service/adventure.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Initiative} from "../../../model/adventure";

@Component({
  selector: 'app-next-turn-dialog',
  templateUrl: './next-turn-dialog.component.html',
  styleUrls: ['./next-turn-dialog.component.scss']
})
export class NextTurnDialogComponent {
  waitForValidation = false;

  constructor(public authService: AuthService,
              private adventureService: AdventureService,
              @Inject(MAT_DIALOG_DATA) public data: {adventureId: number, currentTurn: Initiative}) {
  }

  close(validation: boolean) {
    this.waitForValidation = true;
    this.adventureService.validateNextTurn(this.data.adventureId, validation);
  }
}
