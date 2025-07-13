import { CommonModule } from "@angular/common";
import { Component, HostBinding, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxChange, MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatSelectModule } from "@angular/material/select";
import { TranslateModule } from "@ngx-translate/core";
import { SimpleCampaign } from "../../adventure/model/campaign";
import { CampaignService } from "../../adventure/service/campaign.service";
import { ConfirmDialogComponent } from "../../common/dialog/confirm-dialog.component";
import { ToasterService } from "../../common/service/toaster.service";
import { UserEdit } from "../model/user-edit";
import { UserService } from "../service/user.service";
import { map, tap } from "rxjs";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
  imports: [
    MatIconModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    MatListModule,
    MatCheckboxModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class UserListComponent implements OnInit {
  @HostBinding("class") cssClass = "flex-grow d-flex";

  users: UserEdit[];
  campaigns: SimpleCampaign[];

  selectedUser: UserEdit | null;

  isEdit: boolean = false;
  userEdit: UserEdit = new UserEdit();

  constructor(
    private userService: UserService,
    private campaignService: CampaignService,
    private toaster: ToasterService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.userService
      .getAll()
      .pipe(map((u) => u.sort((a, b) => (a.username.toLowerCase() < b.username.toLowerCase() ? -1 : 1))))
      .subscribe((users) => (this.users = users));

    this.campaignService
      .getAllCampaigns()
      .pipe(
        tap((c) =>
          c.forEach((c) => c.characters.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1))),
        ),
      )
      .subscribe((campaigns) => (this.campaigns = campaigns));
  }

  selectUser(user: UserEdit) {
    this.selectedUser = user;
    this.userEdit = JSON.parse(JSON.stringify(this.selectedUser));
    this.isEdit = false;
  }

  isCharacterSelected(character: { id: number }) {
    return this.userEdit.characters.some((userChar) => userChar.id === character.id);
  }

  createUser() {
    this.selectUser(new UserEdit());
    this.editUser();
  }

  editUser() {
    this.isEdit = true;
  }

  cancel() {
    if (!this.selectedUser.id) this.selectUser(null);
    else this.selectUser(this.selectedUser!);
  }

  deleteUser() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "250px",
      data: {
        title: "Character deletion",
        confirmMessage: "Are ou sure you want to delete " + this.selectedUser!.username + "?",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.delete(this.selectedUser!.id!).subscribe(() => {
          const userIdx = this.users.findIndex((u) => u.id == this.selectedUser!.id);
          this.users.splice(userIdx, 1);
          this.toaster.success("User " + this.selectedUser!.username + " deleted !");
          this.selectedUser = null;
        });
      }
    });
  }

  saveUser() {
    this.selectedUser = this.userEdit;
    if (this.selectedUser.id !== undefined) {
      this.userService.update(this.selectedUser).subscribe((savedUser) => {
        this.selectUser(savedUser);
        const userIdx = this.users.findIndex((u) => u.id == savedUser!.id);
        this.users[userIdx] = savedUser;
        this.toaster.success("User " + savedUser.username + " updated !");
      });
    } else {
      this.userService.create(this.selectedUser).subscribe((createdUser) => {
        this.selectUser(createdUser);
        this.users.push(createdUser);
        this.toaster.success("User " + createdUser.username + " created !");
      });
    }
  }

  toggleCharacterSelected(event: MatCheckboxChange, character: { id: number; name: string }) {
    if (event.checked) {
      this.userEdit.characters.push({
        id: character.id,
        name: character.name,
        campaignId: undefined,
        campaignName: "",
      });
    } else {
      const index = this.userEdit.characters.findIndex((userChar) => userChar.id === character.id);
      if (index !== -1) {
        this.userEdit.characters.splice(index, 1);
      }
    }
  }

  resetPassword() {
    this.userService.updatePassword(this.userEdit).subscribe((updatedUser) => {
      this.selectUser(updatedUser);
      this.ngOnInit();
      this.toaster.success("Password updated !");
    });
  }
}
