import { Component, inject, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  translate = inject(TranslateService);

  ngOnInit(): void {
    if (!!localStorage.getItem("isDark")) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }

    this.translate.use(localStorage.getItem("lang") || "en");
  }
}
