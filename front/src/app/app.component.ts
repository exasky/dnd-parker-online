import {Component, HostBinding, Inject, OnInit} from '@angular/core';
import {AuthService} from "./login/auth.service";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  @HostBinding('class') cssClasses = "d-flex flex-column";

  isDarkTheme = false;

  // TODO i18n

  constructor(public authService: AuthService,
              @Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit(): void {
    this.isDarkTheme = !!localStorage.getItem('isDark');
    if (this.isDarkTheme) {
      this.document.body.classList.add('unicorn-dark-theme');
    } else {
      this.document.body.classList.remove('unicorn-dark-theme');
    }
  }

  switchDarkTheme() {
    if (this.isDarkTheme) {
      this.isDarkTheme = false;
      this.document.body.classList.remove('unicorn-dark-theme');
      localStorage.removeItem('isDark');
    } else {
      this.isDarkTheme = true;
      this.document.body.classList.add('unicorn-dark-theme');
      localStorage.setItem('isDark', 'Y');
    }
  }
}
