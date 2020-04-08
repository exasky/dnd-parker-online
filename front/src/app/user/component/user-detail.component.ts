import {Component, HostBinding} from "@angular/core";
import {LoginService} from "../../login/login.service";
import {UserService} from "../service/user.service";
import {UserEdit} from "../model/user-edit";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html'
})
export class UserDetailComponent {
  @HostBinding('class') cssClasses = 'flex-grow d-flex justify-content-center align-items-center';
  currentUser: UserEdit;

  constructor(private loginService: LoginService,
              private userService: UserService) {

    this.userService.getById(this.loginService.currentUserValue.id).subscribe(userEdit => this.currentUser = userEdit);
  }

  updatePassword() {
    this.userService.updatePassword(this.currentUser).subscribe(updatedUser => {
      this.currentUser = updatedUser;
    });
  }

  saveUser() {
    this.userService.update(this.currentUser).subscribe(updatedUser => {
      this.currentUser = updatedUser;
    });
  }
}
