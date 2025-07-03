import {MatDialogConfig} from "@angular/material/dialog";

export class DialogUtils {
  static getDefaultConfig(data?: any): MatDialogConfig {
    return {
      disableClose: true,
      hasBackdrop: false,
      data
    }
  }
}
