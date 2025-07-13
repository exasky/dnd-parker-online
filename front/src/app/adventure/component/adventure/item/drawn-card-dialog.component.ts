import { CommonModule } from "@angular/common";
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { SocketResponseType } from "../../../../common/model/websocket.response";
import { DrawnCardWebsocketService } from "../../../../common/service/ws/drawn-card.websocket.service";
import { GetCardImagePipe } from "../../../../common/utils/card-utils";
import { AuthService } from "../../../../login/auth.service";
import { Initiative } from "../../../model/adventure";
import { CardMessage, CardMessageType } from "../../../model/card-message";
import { Character, CharacterEquipment } from "../../../model/character";
import { AdventureCardService } from "../../../service/adventure-card.service";
import { AudioService } from "../../../service/audio.service";
import { AdventureUtils } from "../utils/utils";

@Component({
  selector: "app-drawn-card-dialog",
  templateUrl: "./drawn-card-dialog.component.html",
  styleUrls: ["./drawn-card-dialog.component.scss"],
  imports: [
    TranslateModule,
    MatDialogModule,
    MatCheckboxModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    GetCardImagePipe,
  ],
})
export class DrawnCardDialogComponent implements OnInit, OnDestroy {
  isMyTurn = AdventureUtils.isMyTurn;

  public characterName: string;

  private drawnCardWSObs: Subscription;
  isEquipmentSelected: boolean = null;

  constructor(
    private audioService: AudioService,
    public authService: AuthService,
    private adventureCardService: AdventureCardService,
    private cardWS: DrawnCardWebsocketService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      adventureId: number;
      characterId: number;
      chestItemId: number;
      characters: Character[];
      characterItem: CharacterEquipment;
      currentInitiative: Initiative;
    },
  ) {
    this.audioService.playSound("/assets/sound/chest_open_0.mp3");
    this.characterName = data.characters.find((char) => char.id === data.characterId).displayName;
  }

  ngOnInit(): void {
    this.drawnCardWSObs = this.cardWS.getObservable(this.data.adventureId).subscribe((receivedMsg) => {
      if (receivedMsg.type === SocketResponseType.SUCCESS) {
        const message: CardMessage = receivedMsg.data;
        if (message.type === CardMessageType.SELECT_EQUIPMENT) {
          this.isEquipmentSelected = message.message;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.drawnCardWSObs.unsubscribe();
  }

  close(validation: boolean) {
    this.adventureCardService.validateDrawnCard(
      this.data.adventureId,
      this.data.characterId,
      this.data.characterItem.id,
      this.data.chestItemId,
      this.isEquipmentSelected,
      validation,
    );
  }

  addItem(isEquipment: boolean) {
    if (this.isEquipmentSelected === isEquipment) {
      this.adventureCardService.drawCardSetEmplacement(this.data.adventureId, null);
    } else {
      this.adventureCardService.drawCardSetEmplacement(this.data.adventureId, isEquipment);
    }
  }
}
