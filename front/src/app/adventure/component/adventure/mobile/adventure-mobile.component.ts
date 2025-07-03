import { Component, HostBinding, OnDestroy, OnInit } from "@angular/core";
import { SocketResponse } from "../../../../common/model";
import { SocketResponseType } from "../../../../common/model/websocket.response";
import { AdventureMessage, AdventureMessageType } from "../../../model/adventure-message";
import { Subscription } from "rxjs";
import { AdventureWebsocketService } from "../../../../common/service/ws/adventure.websocket.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Adventure, Initiative, LayerElementType, LayerItem, MonsterLayerItem } from "../../../model/adventure";
import { AdventureService } from "../../../service/adventure.service";
import { AuthService } from "../../../../login/auth.service";
import { MonsterItem } from "../../../model/item";
import { AdventureUtils } from "../utils/utils";
import { Character } from "../../../model/character";
import { DiceWebsocketService } from "../../../../common/service/ws/dice.websocket.service";
import { DiceMessage, DiceMessageType } from "../../../model/dice-message";
import { MatTabsModule } from "@angular/material/tabs";
import { GmActionPanelComponent } from "../gm/gm-action-panel.component";
import { TranslateModule } from "@ngx-translate/core";
import { MatIconModule } from "@angular/material/icon";
import { CharacterMobileDisplayerComponent } from "./character-mobile-displayer.component";
import { CapitalizePipe } from "../../../../common/pipe/capitalize.pipe";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-adventure-mobile",
  templateUrl: "./adventure-mobile.component.html",
  styleUrls: ["./adventure-mobile.component.scss"],
  imports: [
    MatTabsModule,
    GmActionPanelComponent,
    TranslateModule,
    MatIconModule,
    CharacterMobileDisplayerComponent,
    CapitalizePipe,
    CommonModule,
  ],
})
export class AdventureMobileComponent implements OnInit, OnDestroy {
  @HostBinding("class") cssClasses = "flex-grow d-flex";

  adventure: Adventure;
  adventureWSObs: Subscription;
  diceWSObs: Subscription;

  currentTurn: Initiative;
  characterTurns: Initiative[];

  monsters: MonsterItem[] = [];
  characters: Character[] = [];

  selectedMonsterId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private adventureService: AdventureService,
    private adventureWS: AdventureWebsocketService,
    private diceWS: DiceWebsocketService,
  ) {}

  ngOnInit(): void {
    const adventureId = this.route.snapshot.paramMap.get("id")!;

    this.adventureService.getAdventure(adventureId).subscribe((adventure) => {
      this.adventure = adventure;

      this.currentTurn = this.adventure.currentTurn;
      this.characterTurns = this.adventure.characterTurns;

      this.characters = this.adventure.campaignCharacters;

      this.authService.currentUserValue.characters = this.characters;

      this.initMonsters();
    });

    this.adventureWSObs = this.adventureWS.getObservable(adventureId).subscribe((receivedMsg: SocketResponse) => {
      if (receivedMsg.type === SocketResponseType.SUCCESS) {
        const message: AdventureMessage = receivedMsg.data;
        switch (message.type) {
          case AdventureMessageType.GOTO:
            this.router.navigateByUrl("adventure/" + message.message).then(() => window.location.reload());
            break;
          case AdventureMessageType.ADD_LAYER_ITEM:
            const newLayerItem: LayerItem = message.message;
            if (newLayerItem.element.type === LayerElementType.MONSTER) {
              this.monsters.push(newLayerItem as MonsterLayerItem);
            }
            break;
          case AdventureMessageType.REMOVE_LAYER_ITEM:
            const layerItem: LayerItem = message.message;
            if (layerItem.element.type === LayerElementType.MONSTER) {
              const foundMonster = this.monsters.find((monster) => monster.id === layerItem.id);
              if (foundMonster) {
                this.removeMonster(foundMonster);
              }
            }
            break;
          case AdventureMessageType.UPDATE_MONSTER:
            const monster: MonsterLayerItem = message.message;
            const monsterToUpdate = this.monsters.find((m) => m.id === monster.id);
            if (monsterToUpdate) {
              monsterToUpdate.hp = monster.hp;
            }
            break;
          case AdventureMessageType.ROLL_INITIATIVE:
            this.characterTurns = message.message;
            break;
          case AdventureMessageType.VALIDATE_NEXT_TURN:
            this.currentTurn = message.message;
            break;
          case AdventureMessageType.UPDATE_CAMPAIGN:
            if (!message.message) {
              this.router.navigateByUrl("");
            } else if (this.adventure.id !== message.message.id) {
              this.router.navigateByUrl("adventure/" + message.message.id).then(() => {
                window.location.reload();
              });
            } else {
              const updatedAdventure: Adventure = message.message;
              updatedAdventure.campaignCharacters.forEach((updatedCharacter) => {
                AdventureUtils.updateCharacter(updatedCharacter, this.characters);
              });
            }
            break;
          case AdventureMessageType.UPDATE_CHARACTER:
            AdventureUtils.updateCharacter(message.message, this.characters);
            break;
          case AdventureMessageType.SELECT_MONSTER:
            this.selectedMonsterId = message.message;
            break;
        }
      }
    });

    this.diceWSObs = this.diceWS.getObservable(adventureId).subscribe((receivedMsg: SocketResponse) => {
      if (receivedMsg.type === SocketResponseType.SUCCESS) {
        const diceMessage: DiceMessage = receivedMsg.data;
        switch (diceMessage.type) {
          case DiceMessageType.OPEN_ATTACK_DIALOG:
            const attackParameters = diceMessage.message;
            if (attackParameters.isMonsterAttacked) {
              this.selectedMonsterId = this.monsters.find((monster) => monster.id === attackParameters.toAttackId)!.id!;
            }
            break;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.adventureWSObs.unsubscribe();
    this.diceWSObs.unsubscribe();
  }

  selectMonster(layerItemId: number) {
    this.selectedMonsterId = layerItemId;
    this.adventureService.selectMonster(this.adventure.id, layerItemId);
  }

  private initMonsters() {
    this.adventure.monsters.forEach((advMonster) => this.monsters.push(advMonster));
  }

  private removeMonster(monster: MonsterItem) {
    this.monsters.splice(this.monsters.indexOf(monster), 1);
  }
}
