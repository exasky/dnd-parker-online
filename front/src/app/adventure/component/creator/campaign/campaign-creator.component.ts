import {Component, HostBinding, OnInit} from "@angular/core";
import {Adventure} from "../../../model/adventure";
import {Campaign} from "../../../model/campaign";
import {Character, CharacterItem} from "../../../model/character";
import {GmService} from "../../../service/gm.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-campaign-creator',
  templateUrl: './campaign-creator.component.html'
})
export class CampaignCreatorComponent implements OnInit {
  @HostBinding('class') cssClasses = "flex-grow d-flex";

  allCharacterItems: CharacterItem[];

  isCharacterCreatorSelected: boolean = true;

  campaign: Campaign;
  selectedAdventure: Adventure;

  constructor(private gmService: GmService,
              private route: ActivatedRoute,
              private router: Router) {
  }


  ngOnInit(): void {
    this.gmService.getAllCharacterItems().subscribe(value => this.allCharacterItems = value);

    const id = this.route.snapshot.paramMap.get("id");
    if (id !== null) {
      this.gmService.getCampaign(id).subscribe(campaign => {
        this.campaign = campaign;
      });
    } else {
      this.campaign = {
        name: '',
        adventures: [],
        characters: [],
        drawnItems: []
      }
    }
  }

  selectAdventure(adventure) {
    this.isCharacterCreatorSelected = false;
    this.selectedAdventure = adventure;
  }

  deleteSelectedAdventure() {
    this.campaign.adventures.splice(this.campaign.adventures.indexOf(this.selectedAdventure), 1);
    this.selectedAdventure = null;
  }

  addNewAdventure() {
    const adventure = new Adventure();

    adventure.name = 'todo';

    this.campaign.adventures.push(adventure);
  }

  addNewCharacter() {
    this.campaign.characters.push(new Character());
  }

  saveCampaign() {
    this.gmService.saveCampaign(this.campaign).subscribe(newCampaign => {
      this.router.navigateByUrl('campaign-creator/' + newCampaign.id)
    });
  }
}
