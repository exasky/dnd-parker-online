import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {AdventureComponent} from "./adventure/component/adventure/adventure.component";
import {AppRoutingModule} from "./app-routing.module";
import {GridsterModule} from "angular-gridster2";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {IndexComponent} from "./index/index.component";
import {MatCardModule} from "@angular/material/card";
import {LoginComponent} from "./login/login.component";
import {JwtInterceptor} from "./login/interceptor/jwt.interceptor";
import {ForbiddenInterceptor} from "./login/interceptor/forbidden.interceptor";
import {AdventureCreatorComponent} from "./adventure/component/creator/adventure/adventure-creator.component";
import {MatStepperModule} from "@angular/material/stepper";
import {CampaignCreatorComponent} from "./adventure/component/creator/campaign/campaign-creator.component";
import {CharacterCreatorComponent} from "./adventure/component/creator/character/character-creator.component";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {CharacterItemDisplayerComponent} from "./adventure/component/creator/character-item-displayer.component";
import {MatTreeModule} from "@angular/material/tree";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatMenuModule} from "@angular/material/menu";
import {UserListComponent} from "./user/component/user-list.component";
import {ConfirmDialogComponent} from "./common/confirm-dialog.component";
import {MatDialogModule} from "@angular/material/dialog";
import {UserDetailComponent} from "./user/component/user-detail.component";
import {AdventureItemDisplayerComponent} from "./adventure/component/adventure/item/adventure-item-displayer.component";
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {CharacterTooltipDisplayerComponent} from "./adventure/component/adventure/character/character-tooltip-displayer.component";
import {RxStompService} from "@stomp/ng2-stompjs";
import {AdventureWebsocketService} from "./common/service/adventure.websocket.service";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    IndexComponent,
    CampaignCreatorComponent,
    AdventureComponent,
    AdventureCreatorComponent,
    CharacterCreatorComponent,
    CharacterItemDisplayerComponent,
    UserListComponent,
    ConfirmDialogComponent,
    UserDetailComponent,
    AdventureItemDisplayerComponent,
    CharacterTooltipDisplayerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    GridsterModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    MatCardModule,
    ReactiveFormsModule,
    MatStepperModule,
    DragDropModule,
    MatTreeModule,
    MatToolbarModule,
    MatSidenavModule,
    MatMenuModule,
    MatDialogModule,
    NgbTooltipModule
  ],
  entryComponents : [ConfirmDialogComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ForbiddenInterceptor, multi: true },
    RxStompService,
    AdventureWebsocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
