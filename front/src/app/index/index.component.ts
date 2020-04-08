import {Component, HostBinding, OnInit} from "@angular/core";
import {AdventureService} from "../adventure/service/adventure.service";
import {LoginService} from "../login/login.service";
import {Router} from "@angular/router";
import {GmService} from "../adventure/service/gm.service";
import {SimpleCampaign} from "../adventure/model/campaign";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html'
})
export class IndexComponent implements OnInit {
  @HostBinding('style.flex-grow') flexGrow = '1';
  @HostBinding('style.min-height') minHeight = '0';
  @HostBinding('style.min-width') minWidth = '0';
  @HostBinding('style.display') display = 'flex';

  public adventures: { id: number; name: string }[];
  public campaigns: SimpleCampaign[];

  constructor(private adventureService: AdventureService,
              private gmService: GmService,
              public loginService: LoginService,
              private router: Router) {
  }

  ngOnInit(): void {
    if (this.loginService.isGM) {
      this.gmService.getAllCampaigns().subscribe(campaigns => this.campaigns = campaigns);
    } else {
      this.adventureService.getCampaignsForCurrentUser().subscribe(campaigns => this.campaigns = campaigns);
    }
  }

  goToAdventure(id: number) {
    this.router.navigateByUrl('adventure/' + id);
  }

  goToCampaignEditor(id: number) {
    this.router.navigateByUrl('campaign-creator/' + id);
  }

  createCampaignAdventure() {
    this.router.navigateByUrl('campaign-creator');
  }
}
