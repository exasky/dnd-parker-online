import { Component, HostBinding, OnInit } from "@angular/core";
import { AdventureService } from "../adventure/service/adventure.service";
import { AuthService } from "../login/auth.service";
import { Router } from "@angular/router";
import { GmService } from "../adventure/service/gm.service";
import { SimpleCampaign } from "../adventure/model/campaign";
import { CampaignService } from "../adventure/service/campaign.service";
import { MatCardModule } from "@angular/material/card";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styles: [".welcome-card { padding: 1em; }"],
  imports: [MatCardModule, TranslateModule, CommonModule, MatButtonModule],
})
export class IndexComponent implements OnInit {
  @HostBinding("class") cssClass =
    "d-flex flex-column align-items-center justify-content-evenly " +
    "offset-lg-3 col-lg-6 " +
    "offset-md-1 col-md-10 ";

  public campaigns: SimpleCampaign[];

  constructor(
    private adventureService: AdventureService,
    private gmService: GmService,
    private campaignService: CampaignService,
    public authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (this.authService.isGM) {
      this.campaignService.getAllCampaigns().subscribe((campaigns) => (this.campaigns = campaigns));
    } else {
      this.adventureService.getCampaignsForCurrentUser().subscribe((campaigns) => (this.campaigns = campaigns));
    }
  }

  goToAdventure(id: number) {
    this.router.navigateByUrl("adventure/" + id);
  }

  goToCampaignEditor(id: number) {
    this.router.navigateByUrl("campaign-creator/" + id);
  }

  createCampaignAdventure() {
    this.router.navigateByUrl("campaign-creator");
  }
}
