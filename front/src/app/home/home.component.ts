import { Component, HostBinding, inject, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterLink, RouterOutlet } from "@angular/router";
import { AuthService } from "../login/auth.service";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    RouterOutlet,
    TranslatePipe,
    CommonModule,
    RouterLink,
  ],
})
export class HomeComponent implements OnInit {
  @HostBinding("class") cssClasses = "d-flex flex-column flex-grow-1 w-100";

  authService = inject(AuthService);
  translate = inject(TranslateService);

  isDarkTheme = false;
  lang = "en";

  ngOnInit(): void {
    this.isDarkTheme = !!localStorage.getItem("isDark");
    this.lang = localStorage.getItem("lang") ?? "en";
  }

  switchLang() {
    this.lang = this.lang === "en" ? "fr" : "en";
    localStorage.setItem("lang", this.lang);
    this.translate.use(this.lang);
  }

  switchDarkTheme() {
    if (this.isDarkTheme) {
      this.isDarkTheme = false;
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
      localStorage.removeItem("isDark");
    } else {
      this.isDarkTheme = true;
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");
      localStorage.setItem("isDark", "Y");
    }
  }
}
