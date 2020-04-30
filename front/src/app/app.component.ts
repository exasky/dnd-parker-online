import {Component, HostBinding, Inject, OnInit} from '@angular/core';
import {AuthService} from "./login/auth.service";
import {DOCUMENT} from "@angular/common";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  @HostBinding('class') cssClasses = "d-flex flex-column";

  isDarkTheme = false;
  lang = 'en';

  constructor(public authService: AuthService,
              private translate: TranslateService,
              @Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit(): void {
    this.isDarkTheme = !!localStorage.getItem('isDark');
    if (this.isDarkTheme) {
      this.document.body.classList.add('unicorn-dark-theme');
      this.document.body.classList.remove('unicorn-light-theme');
    } else {
      this.document.body.classList.add('unicorn-light-theme');
      this.document.body.classList.remove('unicorn-dark-theme');
    }

    this.lang = localStorage.getItem('lang');
    if (!this.lang) this.lang = 'en';

    this.translate.use(this.lang);
  }

  switchLang() {
    this.lang = this.lang === 'en' ? 'fr' : 'en';
    localStorage.setItem('lang', this.lang);
    this.translate.use(this.lang);
  }

  switchDarkTheme() {
    if (this.isDarkTheme) {
      this.isDarkTheme = false;
      this.document.body.classList.add('unicorn-light-theme');
      this.document.body.classList.remove('unicorn-dark-theme');
      localStorage.removeItem('isDark');
    } else {
      this.isDarkTheme = true;
      this.document.body.classList.remove('unicorn-light-theme');
      this.document.body.classList.add('unicorn-dark-theme');
      localStorage.setItem('isDark', 'Y');
    }
  }
}
