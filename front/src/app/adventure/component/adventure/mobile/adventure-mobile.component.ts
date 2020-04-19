import {Component, HostBinding, OnDestroy, OnInit} from "@angular/core";
import {SocketResponse} from "../../../../common/model";
import {SocketResponseType} from "../../../../common/model/websocket.response";
import {AdventureMessage, AdventureMessageType} from "../../../model/adventure-message";
import {Subscription} from "rxjs";
import {AdventureWebsocketService} from "../../../../common/service/ws/adventure.websocket.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Adventure, LayerElementType, LayerItem} from "../../../model/adventure";
import {AdventureService} from "../../../service/adventure.service";
import {AuthService} from "../../../../login/auth.service";
import {Monster} from "../../../model/monster";
import {Character} from "../../../model/character";

@Component({
  selector: 'app-adventure-mobile',
  templateUrl: './adventure-mobile.component.html',
  styleUrls: ['./adventure-mobile.component.scss']
})
export class AdventureMobileComponent implements OnInit, OnDestroy {
  @HostBinding('class') cssClasses = "flex-grow d-flex";

  adventure: Adventure;
  adventureWSObs: Subscription;

  monsters: Monster[] = [];

  selectedCharacterId: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public authService: AuthService,
              private adventureService: AdventureService,
              private adventureWS: AdventureWebsocketService) {
  }

  ngOnInit(): void {
    const adventureId = this.route.snapshot.paramMap.get("id");

    this.adventureService.getAdventure(adventureId).subscribe(adventure => {
      this.adventure = adventure;

      const currentUser = this.authService.currentUserValue;
      currentUser.currentCharacters = this.adventure.characters.filter(character => character.userId === currentUser.id);

      this.initMonsters();
    });

    this.adventureWSObs = this.adventureWS.getObservable(adventureId).subscribe((receivedMsg: SocketResponse) => {
      if (receivedMsg.type === SocketResponseType.SUCCESS) {
        const message: AdventureMessage = receivedMsg.data;
        switch (message.type) {
          case AdventureMessageType.GOTO:
            this.router.navigateByUrl('adventure/' + message.message).then(() => {
              window.location.reload();
            });
            break;
          case AdventureMessageType.ADD_LAYER_ITEM:
            const newLayerItem: LayerItem = message.message;
            this.addMonster(newLayerItem);
            break;
          case AdventureMessageType.REMOVE_LAYER_ITEM:
            const layerItemId = message.message;
            const monsterToRemove = this.monsters.find(monsterItem => monsterItem.layerItemId === layerItemId);
            this.removeMonster(monsterToRemove);
            break;
          case AdventureMessageType.SELECT_CHARACTER:
            this.selectedCharacterId = message.message;
            break;
          case AdventureMessageType.UPDATE_CAMPAIGN:
            if (!message.message) {
              this.router.navigateByUrl('');
            } else if (this.adventure.id !== message.message.id) {
              this.router.navigateByUrl('adventure/' + message.message.id).then(() => {
                window.location.reload();
              });
            } else {
              const updatedAdventure: Adventure = message.message;
              // this.adventure.characters = updatedAdventure.characters;
              updatedAdventure.characters.forEach(updatedCharacter => {
                const toUpdate = this.adventure.characters.find(advChar => advChar.id === updatedCharacter.id);
                toUpdate.maxMp = updatedCharacter.maxMp;
                toUpdate.mp = updatedCharacter.mp;
                toUpdate.maxHp = updatedCharacter.maxHp;
                toUpdate.hp = updatedCharacter.hp;

                toUpdate.equippedItems = updatedCharacter.equippedItems;
                toUpdate.backpackItems = updatedCharacter.backpackItems;
              })
            }
            break;
          case AdventureMessageType.UPDATE_CHARACTER:
            const character: Character = message.message;
            const toUpdate = this.adventure.characters.find(advChar => advChar.id === character.id);
            if (toUpdate) {
              toUpdate.hp = character.hp;
              toUpdate.mp = character.mp;
            }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.adventureWSObs.unsubscribe();
  }

  private initMonsters() {
    this.adventure.characterLayer.items
      .filter(item => item.element.type === LayerElementType.MONSTER)
      .forEach(monsterItem => {
        if (!this.monsters.some(monster => monster.layerItemId === monsterItem.id)) {
          this.addMonster(monsterItem);
        }
      })
  }

  private addMonster(item: LayerItem) {
    const monsterIdx = this.monsters.length !== 0 ? this.monsters[this.monsters.length - 1].index + 1 : 0;
    this.monsters.push({
      layerItemId: item.id,
      hp: 0,
      name: item.element.icon,
      index: monsterIdx
    })
  }

  private removeMonster(monster: Monster) {
    if (!monster) return;
    this.monsters.splice(this.monsters.indexOf(monster), 1);
  }
}
