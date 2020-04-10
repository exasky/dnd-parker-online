import {Component, HostBinding, Inject, OnInit} from '@angular/core';
import {LoginService} from "./login/login.service";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  @HostBinding('class') cssClasses = "d-flex flex-column";

  // TODO observe mouve players to display to others in adventure

  // TODO Draw card websocket popup each player to display the card

  // TODO add next adventure button

  // TODO dice launcher 2D. prendre chaqu'une des faces d'un dé, faire un rand 1-6
  // TODO Pouvoir choisir les dés à lancer
  // TODO stocker en base pour avoir une liste avec des noms et des ids
  // TODO les noms des images : dice_id/name -face1.jpg -face2.jpg rand 1-5

  isDarkTheme = false;

  constructor(public loginService: LoginService,
              @Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit(): void {
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
    } else {
      this.isDarkTheme = true;
      this.document.body.classList.add('unicorn-dark-theme');
    }
  }
}
