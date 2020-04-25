import {AuthService} from "../../../../login/auth.service";
import {Component, Inject} from "@angular/core";
import {AdventureService} from "../../../service/adventure.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-next-turn-dialog',
  templateUrl: './next-turn-dialog.component.html',
  styleUrls: ['./next-turn-dialog.component.scss']
})
export class NextTurnDialogComponent {
  constructor(public authService: AuthService,
              private adventureService: AdventureService,
              @Inject(MAT_DIALOG_DATA) public adventureId: number) {
  }

  close(validation: boolean) {
    this.adventureService.validateNextTurn(this.adventureId, validation);
  }
}
