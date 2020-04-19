import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CharacterItem} from "../../../model/character";
import {AudioService} from "../../../service/audio.service";

@Component({
  selector: 'app-drawn-card-dialog',
  templateUrl: './drawn-card-dialog.component.html',
  styleUrls: ['./draw-card-dialog.component.scss']
})
export class DrawnCardDialogComponent {

  constructor(public dialogRef: MatDialogRef<DrawnCardDialogComponent>,
              private audioService: AudioService,
              @Inject(MAT_DIALOG_DATA) public data: CharacterItem) {
    this.audioService.playSound('/assets/sound/chest_open_0.mp3');
  }
}
