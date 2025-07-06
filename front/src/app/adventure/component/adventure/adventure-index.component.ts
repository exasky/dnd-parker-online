import { Component, HostBinding } from "@angular/core";
import { MobileService } from "../../../common/service/mobile.service";
import { AdventureComponent } from "./adventure.component";
import { AdventureMobileComponent } from "./mobile/adventure-mobile.component";

@Component({
  selector: "app-index-adventure",
  template: `
    @if (mobileService.isMobile()) {
      <app-adventure-mobile />
    } @else {
      <app-adventure />
    }
  `,
  imports: [AdventureComponent, AdventureMobileComponent],
})
export class AdventureIndexComponent {
  @HostBinding("class") cssClasses = "flex-grow d-flex";

  constructor(public mobileService: MobileService) {}
}
