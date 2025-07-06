import { AuthService } from "../../../../login/auth.service";
import { Component, inject, Inject } from "@angular/core";
import { AdventureService } from "../../../service/adventure.service";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { Initiative } from "../../../model/adventure";
import { TranslateModule } from "@ngx-translate/core";
import { CapitalizePipe } from "../../../../common/pipe/capitalize.pipe";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-next-turn-dialog",
  templateUrl: "./next-turn-dialog.component.html",
  styleUrls: ["./next-turn-dialog.component.scss"],
  imports: [MatDialogModule, TranslateModule, CapitalizePipe, CommonModule, MatButtonModule],
})
export class NextTurnDialogComponent {
  waitForValidation = false;
  data: { adventureId: number; currentTurn: Initiative } = inject(MAT_DIALOG_DATA);

  constructor(
    public authService: AuthService,
    private adventureService: AdventureService,
  ) {}

  close(validation: boolean) {
    this.waitForValidation = true;
    this.adventureService.validateNextTurn(this.data.adventureId, validation);
  }
}
