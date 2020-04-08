import {Component, HostBinding, Inject} from '@angular/core';
import {LoginService} from "./login/login.service";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  @HostBinding('class') cssClasses = "d-flex flex-column";

  isDarkTheme = false;

  constructor(public loginService: LoginService,
              @Inject(DOCUMENT) private document: Document) {
  }
  switchDarkTheme() {
    if (this.isDarkTheme) {
      this.isDarkTheme = false;
      this.document.body.classList.remove('unicorn-dark-theme');
    } else {
      this.isDarkTheme = true;
      this.document.body.classList.add('unicorn-dark-theme');
    }

  }
}
