import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
// import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private toaster: ToastrService/*,
              private translate: TranslateService*/) {
  }

  public success(message: string) {
    this.toaster.success(this.getMessage(message));
  }

  public warning(message: string) {
    this.toaster.warning(this.getMessage(message));
  }

  public error(message: string) {
    this.toaster.error(this.getMessage(message));
  }

  private getMessage(message: string) {
    return message;
    // let toDisplay;
    // try {
    //   toDisplay = this.translate.instant(message);
    // } catch (e) {
    //   toDisplay = message;
    // }
    //
    // return toDisplay;
  }
}
