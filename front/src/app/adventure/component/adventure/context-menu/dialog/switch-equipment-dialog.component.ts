import { CommonModule } from "@angular/common";
import { Component, HostBinding, Inject, OnDestroy, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { TranslateModule } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { SocketResponse } from "../../../../../common/model";
import { SocketResponseType } from "../../../../../common/model/websocket.response";
import { AdventureWebsocketService } from "../../../../../common/service/ws/adventure.websocket.service";
import { CardUtils } from "../../../../../common/utils/card-utils";
import { AuthService } from "../../../../../login/auth.service";
import { AdventureMessage, AdventureMessageType } from "../../../../model/adventure-message";
import { Character, CharacterEquipment } from "../../../../model/character";
import { AdventureService } from "../../../../service/adventure.service";
import { AudioService } from "../../../../service/audio.service";
import { GmService } from "../../../../service/gm.service";

@Component({
  selector: "app-switch-equipment-dialog",
  templateUrl: "./switch-equipment-dialog.component.html",
  styles: [".selected {background-color: rgb(160, 160, 160); border-radius: 7px; padding: 10px}"],
  imports: [TranslateModule, MatDividerModule, MatDialogModule, CommonModule],
})
export class SwitchEquipmentDialogComponent implements OnInit, OnDestroy {
  @HostBinding("style.height") height = "75vh";
  @HostBinding("style.width") width = "50vw";
  @HostBinding("class") cssClass = "d-flex flex-column";

  getCardImage = CardUtils.getCardImage;

  private advSub: Subscription;

  equippedSelected: CharacterEquipment;
  backpackSelected: CharacterEquipment;

  constructor(
    public authService: AuthService,
    private gmService: GmService,
    private adventureService: AdventureService,
    private adventureWS: AdventureWebsocketService,
    private audioService: AudioService,
    @Inject(MAT_DIALOG_DATA) public data: { adventureId: number; character: Character },
  ) {}

  ngOnInit(): void {
    this.audioService.playSound("/assets/sound/bag_1.mp3");
    this.advSub = this.adventureWS.getObservable(this.data.adventureId).subscribe((receivedMsg: SocketResponse) => {
      if (receivedMsg.type === SocketResponseType.SUCCESS) {
        const message: AdventureMessage = receivedMsg.data;
        switch (message.type) {
          case AdventureMessageType.SELECT_SWITCH_CARD:
            const card: { equipmentId: number; isEquipment: boolean } = message.message;
            if (card.isEquipment) {
              this.equippedSelected =
                this.equippedSelected && this.equippedSelected.id === card.equipmentId
                  ? null
                  : (this.equippedSelected = this.data.character.equippedItems.find(
                      (it) => it.id === card.equipmentId,
                    ));
            } else {
              this.backpackSelected =
                this.backpackSelected && this.backpackSelected.id === card.equipmentId
                  ? null
                  : this.data.character.backpackItems.find((it) => it.id === card.equipmentId);
            }
            break;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.advSub.unsubscribe();
  }

  isSwitchAuthorized(): boolean {
    return this.authService.currentUserValue.characters.some((userChar) => userChar.id === this.data.character.id);
  }

  selectEquipment(item: CharacterEquipment, isEquipment) {
    if (this.isSwitchAuthorized) {
      this.adventureService.selectSwitch(this.data.adventureId, { equipmentId: item.id, isEquipment });
    }
  }

  cancelSwitch() {
    this.gmService.closeDialog(this.data.adventureId);
  }

  validateSwitch() {
    this.adventureService.validateSwitch(this.data.adventureId, {
      characterId: this.data.character.id,
      characterEquippedItemId: this.equippedSelected ? this.equippedSelected.id : null,
      characterBackpackItemId: this.backpackSelected ? this.backpackSelected.id : null,
    });
  }
}
