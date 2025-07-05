import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { Router } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { SimpleCampaign } from "../adventure/model/campaign";
import { AdventureService } from "../adventure/service/adventure.service";
import { CampaignService } from "../adventure/service/campaign.service";
import { AuthService } from "../login/auth.service";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.scss"],
  imports: [MatCardModule, TranslateModule, CommonModule, MatButtonModule],
})
export class IndexComponent implements OnInit {
  public campaigns: SimpleCampaign[];

  constructor(
    private adventureService: AdventureService,
    private campaignService: CampaignService,
    public authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (this.authService.isGM()) {
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
