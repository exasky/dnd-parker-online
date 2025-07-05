import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { Subscription } from "rxjs";
import { SocketResponse } from "../../../../common/model";
import { SocketResponseType } from "../../../../common/model/websocket.response";
import { AdventureWebsocketService } from "../../../../common/service/ws/adventure.websocket.service";
import { AuthService } from "../../../../login/auth.service";
import { AdventureMessage, AdventureMessageType, MouseMove } from "../../../model/adventure-message";
import { CharacterLayerGridsterItem } from "../../../model/layer-gridster-item";

@Component({
  selector: "app-players-cursor",
  templateUrl: "./players-cursor.component.html",
  styleUrls: ["./players-cursor.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
})
export class PlayersCursorComponent implements OnInit, OnDestroy {
  @Input()
  adventureId: number;

  @Input()
  characters: CharacterLayerGridsterItem[];

  private adventureWSObs: Subscription;

  cursors: MouseMove[] = [];

  constructor(
    private adventureWS: AdventureWebsocketService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.adventureWSObs = this.adventureWS.getObservable(this.adventureId).subscribe((receivedMsg: SocketResponse) => {
      if (receivedMsg.type != SocketResponseType.SUCCESS) return;

      const message: AdventureMessage = receivedMsg.data;
      if (message.type != AdventureMessageType.MOUSE_MOVE) return;

      const mouseMoveEvent: MouseMove = message.message;
      // Do not add own cursor
      if (mouseMoveEvent.userId !== this.authService.currentUserValue.id) {
        // Mouse out
        if (mouseMoveEvent.x === mouseMoveEvent.y && mouseMoveEvent.y === -1) {
          let playerCursorIxd = this.cursors.findIndex((pc) => pc.userId === mouseMoveEvent.userId);
          if (playerCursorIxd !== -1) {
            this.cursors.splice(playerCursorIxd, 1);
          }
          // Mouse move
        } else {
          mouseMoveEvent.x = mouseMoveEvent.x - mouseMoveEvent.offsetX;
          mouseMoveEvent.y = mouseMoveEvent.y - mouseMoveEvent.offsetY;

          const charNames = this.getCharacterNamesFromId(mouseMoveEvent.userId);
          mouseMoveEvent["char"] = charNames[0];
          mouseMoveEvent["chars"] = charNames;

          let playerCursorIxd = this.cursors.findIndex((pc) => pc.userId === mouseMoveEvent.userId);
          if (playerCursorIxd === -1) {
            this.cursors.push(mouseMoveEvent);
          } else {
            this.cursors[playerCursorIxd] = mouseMoveEvent;
          }
        }
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy() {
    this.adventureWSObs.unsubscribe();
  }

  private getCharacterNamesFromId(userId) {
    const characters = this.characters.filter((char) => char.id && char.character.userId === userId);
    return characters.length !== 0 ? characters.map((char) => char.name) : ["MJ"];
  }
}
