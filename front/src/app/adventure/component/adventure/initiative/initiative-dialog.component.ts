import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Initiative} from "../../../model/adventure";
import {AuthService} from "../../../../login/auth.service";
import {GmService} from "../../../service/gm.service";

@Component({
  selector: 'app-initiative-dialog',
  templateUrl: './initiative-dialog.component.html'
})
export class InitiativeDialogComponent {
  constructor(public authService: AuthService,
              private gmService: GmService,
              @Inject(MAT_DIALOG_DATA) public data: { adventureId: number, initiatives: Initiative[] }) {
  }

  close() {
    this.gmService.closeDialog(this.data.adventureId);
  }
}
