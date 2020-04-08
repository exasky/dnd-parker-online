import {Component, HostBinding, OnInit} from "@angular/core";
import {UserService} from "../service/user.service";
import {UserEdit} from "../model/user-edit"
import {GmService} from "../../adventure/service/gm.service";
import {SimpleCampaign} from "../../adventure/model/campaign";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  @HostBinding('class') cssClass = 'flex-grow d-flex flex-column'

  users: UserEdit[];
  campaigns: SimpleCampaign[];

  newUser: UserEdit;

  constructor(private userService: UserService,
              private gmService: GmService) {
  }

  ngOnInit(): void {
    this.userService.getAll().subscribe(users => this.users = users);
    this.gmService.getAllCampaigns().subscribe(campaigns => this.campaigns = campaigns);
  }

  createUser() {
    this.newUser = new UserEdit();
    this.newUser.characters = [];
  }

  editUser(user: UserEdit) {
    this.newUser = user;
  }

  saveUser() {
    if (this.newUser.id !== undefined) {
      this.userService.update(this.newUser).subscribe(() => {
        this.newUser = null;
        this.userService.getAll().subscribe(users => this.users = users);
      });
    } else {
      this.userService.create(this.newUser).subscribe(() => {
        this.newUser = null;
        this.userService.getAll().subscribe(users => this.users = users);
      });
    }
  }
}
