import {Component, HostBinding} from '@angular/core';
import {LoginService} from "./login/login.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  @HostBinding('class') cssClasses = "d-flex flex-column";

  constructor(public loginService: LoginService) {
  }
}
