import {Component, HostBinding, OnInit} from "@angular/core";
import {UserService} from "../service/user.service";
import {UserEdit} from "../model/user-edit"
import {GmService} from "../../adventure/service/gm.service";
import {SimpleCampaign} from "../../adventure/model/campaign";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../../common/dialog/confirm-dialog.component";
import {MatCheckboxChange} from "@angular/material/checkbox/checkbox";
import {ToasterService} from "../../common/service/toaster.service";
import {CampaignService} from "../../adventure/service/campaign.service";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  @HostBinding('class') cssClass = 'flex-grow d-flex'

  users: UserEdit[];
  campaigns: SimpleCampaign[];

  selectedUser: UserEdit;

  isEdit: boolean = false;
  userEdit: UserEdit = new UserEdit();

  constructor(private userService: UserService,
              private gmService: GmService,
              private campaignService: CampaignService,
              private toaster: ToasterService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.userService.getAll().subscribe(users => this.users = users
      .sort((a, b) => (a.username.toLowerCase() < b.username.toLowerCase()) ? -1 : 1));
    this.campaignService.getAllCampaigns().subscribe(campaigns => {
      this.campaigns = campaigns;
      this.campaigns.forEach(campaign => campaign.characters
        .sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1));
    });
  }

  selectUser(user: UserEdit) {
    this.selectedUser = user;
    this.userEdit = JSON.parse(JSON.stringify(this.selectedUser));
    this.isEdit = false;
  }

  isCharacterSelected(character: { id: number; name: string }) {
    return this.userEdit.characters.some(userChar => userChar.id === character.id);
  }

  createUser() {
    const newUser = new UserEdit();
    newUser.characters = [];
    this.selectUser(newUser);
    this.isEdit = true;
  }

  editUser() {
    this.isEdit = true;
  }

  cancel() {
    this.selectUser(this.selectedUser);
  }

  deleteUser() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {title: 'Character deletion', confirmMessage: 'Are ou sure you want to delete ' + this.selectedUser.username + '?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.delete(this.selectedUser.id).subscribe(() => {
          this.ngOnInit();
          this.toaster.success('User ' + this.selectedUser.username + ' deleted !');
          this.selectedUser = null;
        });
      }
    });
  }

  saveUser() {
    this.selectedUser = this.userEdit;
    if (this.selectedUser.id !== undefined) {
      this.userService.update(this.selectedUser).subscribe(savedUser => {
        this.selectUser(savedUser);
        this.ngOnInit();
        this.toaster.success('User ' + savedUser.username + ' updated !');
      });
    } else {
      this.userService.create(this.selectedUser).subscribe(createdUser => {
        this.selectUser(createdUser);
        this.ngOnInit();
        this.toaster.success('User ' + createdUser.username + ' created !');
      });
    }
  }

  toggleCharacterSelected(event: MatCheckboxChange, character: { id: number; name: string }) {
    if (event.checked) {
      this.userEdit.characters.push({id: character.id, name: character.name, campaignId: null, campaignName: ''});
    } else {
      const index = this.userEdit.characters.findIndex(userChar => userChar.id === character.id);
      if (index !== -1) {
        this.userEdit.characters.splice(index, 1);
      }
    }
  }

  resetPassword() {
    this.userService.updatePassword(this.userEdit).subscribe(updatedUser => {
      this.selectUser(updatedUser);
      this.ngOnInit();
      this.toaster.success("Password updated !");
    });
  }
}
