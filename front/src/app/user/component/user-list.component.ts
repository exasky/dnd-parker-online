import {Component, HostBinding, OnInit} from "@angular/core";
import {UserService} from "../service/user.service";
import {UserEdit} from "../model/user-edit"
import {GmService} from "../../adventure/service/gm.service";
import {SimpleCampaign} from "../../adventure/model/campaign";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../../common/confirm-dialog.component";

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
              private gmService: GmService,
              private dialog: MatDialog) {
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

  deleteUser(user: UserEdit) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {title: 'Character deletion', confirmMessage: 'Are ou sure you want to delete ' + user.username + '?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.delete(user.id).subscribe(() => this.ngOnInit());
      }
    });
  }

  saveUser() {
    if (this.newUser.id !== undefined) {
      this.userService.update(this.newUser).subscribe(() => {
        this.newUser = null;
        this.ngOnInit();
      });
    } else {
      this.userService.create(this.newUser).subscribe(() => {
        this.newUser = null;
        this.ngOnInit();
      });
    }
  }
}