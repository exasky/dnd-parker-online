import {Component, HostBinding} from "@angular/core";
import {AuthService} from "../../login/auth.service";
import {UserService} from "../service/user.service";
import {UserEdit} from "../model/user-edit";
import {ToasterService} from "../../common/service/toaster.service";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html'
})
export class UserDetailComponent {
  @HostBinding('class') cssClasses = 'flex-grow d-flex justify-content-center align-items-center';
  currentUser: UserEdit;

  constructor(private authService: AuthService,
              private userService: UserService,
              private toaster: ToasterService) {

    this.userService.getById(this.authService.currentUserValue.id).subscribe(userEdit => this.currentUser = userEdit);
  }

  updatePassword() {
    this.userService.updatePassword(this.currentUser).subscribe(updatedUser => {
      this.currentUser = updatedUser;
      this.toaster.success("Password updated !");
    });
  }

  saveUser() {
    this.userService.update(this.currentUser).subscribe(updatedUser => {
      this.currentUser = updatedUser;
    });
  }
}
