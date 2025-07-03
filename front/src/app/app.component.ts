import { CommonModule, DOCUMENT } from "@angular/common";
import { Component, HostBinding, Inject, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterLink, RouterOutlet } from "@angular/router";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { AuthService } from "./login/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    TranslateModule,
    MatSidenavModule,
    RouterOutlet,
    CommonModule,
    RouterLink,
  ],
})
export class AppComponent implements OnInit {
  @HostBinding("class") cssClasses = "d-flex flex-column";

  isDarkTheme = false;
  lang = "en";

  constructor(
    public authService: AuthService,
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ngOnInit(): void {
    this.isDarkTheme = !!localStorage.getItem("isDark");
    if (this.isDarkTheme) {
      this.document.body.classList.add("dark-mode");
      this.document.body.classList.remove("light-mode");
    } else {
      this.document.body.classList.add("light-mode");
      this.document.body.classList.remove("dark-mode");
    }

    this.lang = localStorage.getItem("lang");
    if (!this.lang) this.lang = "en";

    this.translate.use(this.lang);
  }

  switchLang() {
    this.lang = this.lang === "en" ? "fr" : "en";
    localStorage.setItem("lang", this.lang);
    this.translate.use(this.lang);
  }

  switchDarkTheme() {
    if (this.isDarkTheme) {
      this.isDarkTheme = false;
      this.document.body.classList.add("light-mode");
      this.document.body.classList.remove("dark-mode");
      localStorage.removeItem("isDark");
    } else {
      this.isDarkTheme = true;
      this.document.body.classList.remove("light-mode");
      this.document.body.classList.add("dark-mode");
      localStorage.setItem("isDark", "Y");
    }
  }
}
