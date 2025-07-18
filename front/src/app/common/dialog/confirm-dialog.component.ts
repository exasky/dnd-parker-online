import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "dialog-overview-example-dialog",
  templateUrl: "./confirm-dialog.component.html",
  imports: [MatDialogModule, MatButtonModule],
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export class ConfirmDialogData {
  title: string;
  confirmMessage: string;
}
