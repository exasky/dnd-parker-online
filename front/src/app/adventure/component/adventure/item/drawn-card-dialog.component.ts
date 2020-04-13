import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CharacterItem} from "../../../model/character";

@Component({
  selector: 'app-drawn-card-dialog',
  templateUrl: './drawn-card-dialog.component.html',
  styleUrls: ['./draw-card-dialog.component.scss']
})
export class DrawnCardDialogComponent {

  constructor(public dialogRef: MatDialogRef<DrawnCardDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: CharacterItem) {
  }
}
