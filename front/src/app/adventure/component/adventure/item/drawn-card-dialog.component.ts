import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CharacterItem} from "../../../model/character";

@Component({
  selector: 'drawn-card-dialog',
  templateUrl: './drawn-card-dialog.component.html',
})
export class DrawnCardDialogComponent {

  constructor(public dialogRef: MatDialogRef<DrawnCardDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: CharacterItem) {
  }

}
