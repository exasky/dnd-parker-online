import {Component, HostBinding, OnInit} from "@angular/core";
import {AdventureService} from "../adventure/service/adventure.service";
import {LoginService} from "../login/login.service";
import {Router} from "@angular/router";

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

  constructor(private adventureService: AdventureService,
              public loginService: LoginService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.adventureService.getAdventures().subscribe(adventures => {
      this.adventures = adventures;
    })
  }

  goToAdventure(id: number) {
    this.router.navigateByUrl('adventure/' + id);
  }

  createCampaignAdventure() {
    this.router.navigateByUrl('campaign-creator');
  }
}
