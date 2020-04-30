import {Component, HostBinding, OnInit} from "@angular/core";
import {Adventure} from "../../../model/adventure";
import {Campaign, SimpleCampaign} from "../../../model/campaign";
import {Character, CharacterEquipment, CharacterTemplate} from "../../../model/character";
import {GmService} from "../../../service/gm.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmDialogComponent} from "../../../../common/dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ToasterService} from "../../../../common/service/toaster.service";
import {AdventureService} from "../../../service/adventure.service";
import {MatSelectChange} from "@angular/material/select";
import {CampaignService} from "../../../service/campaign.service";

@Component({
  selector: 'app-campaign-creator',
  templateUrl: './campaign-creator.component.html'
})
export class CampaignCreatorComponent implements OnInit {
  @HostBinding('class') cssClasses = "flex-grow d-flex";

  characterTemplates: CharacterTemplate[];
  selectedCharacterTemplates: CharacterTemplate[] = [];
  allCharacterItems: CharacterEquipment[];

  isCharacterCreatorSelected: boolean = true;

  campaign: Campaign;
  selectedAdventure: Adventure;

  allCampaigns: SimpleCampaign[];

  constructor(private gmService: GmService,
              private campaignService: CampaignService,
              private adventureService: AdventureService,
              private dialog: MatDialog,
              private toaster: ToasterService,
              private route: ActivatedRoute,
              private router: Router) {
  }


  ngOnInit(): void {
    this.campaignService.getAllCampaigns().subscribe(campaigns => this.allCampaigns = campaigns);
    this.gmService.getAllCharacterItems().subscribe(value => this.allCharacterItems = value);

    const id = this.route.snapshot.paramMap.get("id");
    if (id !== null) {
      this.campaignService.getCampaign(id).subscribe(campaign => {
        this.campaign = campaign;
        this.adventureService.getCharacterTemplates().subscribe(value => {
          this.characterTemplates = value.filter(ct => this.campaign.characters.findIndex(char => char.name === ct.name) === -1);
        });
      });
    } else {
      this.campaign = {
        name: '',
        adventures: [],
        characters: [],
        drawnItems: []
      }
      this.adventureService.getCharacterTemplates().subscribe(value => this.characterTemplates = value);
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
    if (this.campaign.characters.length < 4) {
      this.campaign.characters.push(new Character());
    }
  }

  removeCharacter(event: Character) {
    const characterIdx = this.campaign.characters.indexOf(event);
    if (characterIdx !== -1) {
      const characterTemplate = this.selectedCharacterTemplates.find(sct => sct.name === event.name);
      if (characterTemplate) {
        this.characterTemplates.push(characterTemplate);
        this.selectedCharacterTemplates.splice(this.selectedCharacterTemplates.indexOf(characterTemplate), 1);
      }
      this.campaign.characters.splice(characterIdx, 1);
    }
  }

  copyFrom($event: MatSelectChange) {
    if ($event.value) {
      const toCopyCampaignId = $event.value;
      this.campaignService.copyFrom(toCopyCampaignId).subscribe(newCampaign => {
        this.campaign = newCampaign;
      });
    }
  }

  saveCampaign() {
    this.campaignService.saveCampaign(this.campaign).subscribe(newCampaign => {
      if (this.campaign.id !== newCampaign.id) {
        this.router.navigate([newCampaign.id], {relativeTo: this.route});
      }
      this.campaign = newCampaign;
      if (this.selectedAdventure) {
        this.selectedAdventure = this.campaign.adventures.find(campAdv => campAdv.id === this.selectedAdventure.id);
      }
      this.adventureService.getCharacterTemplates().subscribe(value => {
        this.characterTemplates = value.filter(ct => this.campaign.characters.findIndex(char => char.name === ct.name) === -1);
      });
      this.toaster.success('Success saving campaign ' + newCampaign.name);
    });
  }

  deleteCampaign() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {title: 'Campaign deletion', confirmMessage: 'Are ou sure you want to delete ' + this.campaign.name + '?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.campaignService.deleteCampaign(this.campaign.id).subscribe(() => {
          this.toaster.success("Campaign " + this.campaign.name + " deleted !");
          this.router.navigateByUrl('');
        });
      }
    });
  }

  removeAvailableCharacter(event: CharacterTemplate) {
    const idx = this.characterTemplates.findIndex(ct => ct.name === event.name);
    if (idx !== -1) {
      this.selectedCharacterTemplates.push(event);
      this.characterTemplates.splice(idx, 1);
    } else {
      console.log('Error on removing available character');
    }
  }
}
