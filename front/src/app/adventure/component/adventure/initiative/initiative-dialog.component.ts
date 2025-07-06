import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { TranslateModule } from "@ngx-translate/core";
import { AuthService } from "../../../../login/auth.service";
import { Initiative } from "../../../model/adventure";
import { GmService } from "../../../service/gm.service";
import { InitiativeDisplayerComponent } from "./initiative-displayer.component";

@Component({
  selector: "app-initiative-dialog",
  templateUrl: "./initiative-dialog.component.html",
  imports: [InitiativeDisplayerComponent, MatDialogModule, TranslateModule, CommonModule, MatButtonModule],
})
export class InitiativeDialogComponent {
  constructor(
    public authService: AuthService,
    private gmService: GmService,
    @Inject(MAT_DIALOG_DATA) public data: { adventureId: number; initiatives: Initiative[] },
  ) {}

  close() {
    this.gmService.closeDialog(this.data.adventureId);
  }
}
