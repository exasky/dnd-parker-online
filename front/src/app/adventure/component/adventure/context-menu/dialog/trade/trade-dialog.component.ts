import { Component, HostBinding, Inject, OnDestroy, OnInit } from "@angular/core";
import { Character, CharacterEquipment } from "../../../../../model/character";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { AuthService } from "../../../../../../login/auth.service";
import { AdventureWebsocketService } from "../../../../../../common/service/ws/adventure.websocket.service";
import { Subscription } from "rxjs";
import { SocketResponse } from "../../../../../../common/model";
import { SocketResponseType } from "../../../../../../common/model/websocket.response";
import { AdventureMessage, AdventureMessageType } from "../../../../../model/adventure-message";
import { AdventureService } from "../../../../../service/adventure.service";
import { GmService } from "../../../../../service/gm.service";
import { AudioService } from "../../../../../service/audio.service";
import { TranslateModule } from "@ngx-translate/core";
import { TradeCharacterItemDisplayerComponent } from "./trade-character-item-displayer.component";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-trade-dialog",
  templateUrl: "./trade-dialog.component.html",
  imports: [TranslateModule, MatDialogModule, TradeCharacterItemDisplayerComponent, MatIconModule, CommonModule],
})
export class TradeDialogComponent implements OnInit, OnDestroy {
  @HostBinding("style.height") height = "75vh";
  @HostBinding("style.width") width = "75vw";
  @HostBinding("class") cssClass = "d-flex flex-column";

  private advSub: Subscription;

  selectedFrom: { characterEquipment: CharacterEquipment; isEquipment } = {
    characterEquipment: null,
    isEquipment: false,
  };
  selectedTo: { characterEquipment: CharacterEquipment; isEquipment } = {
    characterEquipment: null,
    isEquipment: false,
  };

  constructor(
    public authService: AuthService,
    private gmService: GmService,
    private adventureService: AdventureService,
    private adventureWS: AdventureWebsocketService,
    private audioService: AudioService,
    @Inject(MAT_DIALOG_DATA) public data: { adventureId: number; trade: { from: Character; to: Character } },
  ) {}

  ngOnInit(): void {
    this.audioService.playSound("/assets/sound/bag_0.mp3");
    this.advSub = this.adventureWS.getObservable(this.data.adventureId).subscribe((receivedMsg: SocketResponse) => {
      if (receivedMsg.type === SocketResponseType.SUCCESS) {
        const message: AdventureMessage = receivedMsg.data;
        switch (message.type) {
          case AdventureMessageType.SELECT_TRADE_CARD:
            const card: { isFrom: boolean; characterEquipment: CharacterEquipment; isEquipment } = message.message;
            if (card.isFrom) {
              this.selectedFrom = card.characterEquipment
                ? { characterEquipment: card.characterEquipment, isEquipment: card.isEquipment }
                : { characterEquipment: null, isEquipment: false };
            } else {
              this.selectedTo = card.characterEquipment
                ? { characterEquipment: card.characterEquipment, isEquipment: card.isEquipment }
                : { characterEquipment: null, isEquipment: false };
            }
            break;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.advSub.unsubscribe();
  }

  cancelTrade() {
    this.gmService.closeDialog(this.data.adventureId);
  }

  selectEquipment(equipment: { characterEquipment: CharacterEquipment; isEquipment }, isFrom) {
    if (this.isClickAuthorized(isFrom)) {
      this.adventureService.selectTradeEquipment(this.data.adventureId, equipment, isFrom);
    }
  }

  isClickAuthorized(isFrom: boolean): boolean {
    return this.authService.currentUserValue.characters.some(
      (userChar) => userChar.id === (isFrom ? this.data.trade.from.id : this.data.trade.to.id),
    );
  }

  validateTrade() {
    this.adventureService.validateTrade(this.data.adventureId, {
      fromCharacterId: this.data.trade.from.id,
      fromCharacterEquipment: this.selectedFrom.characterEquipment?.id,
      fromCharacterIsEquipment: this.selectedFrom.isEquipment,
      toCharacterId: this.data.trade.to.id,
      toCharacterEquipment: this.selectedTo.characterEquipment?.id,
      toCharacterIsEquipment: this.selectedTo.isEquipment,
    });
  }
}
