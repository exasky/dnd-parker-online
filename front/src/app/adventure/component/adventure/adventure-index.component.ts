import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Component, HostBinding } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AdventureComponent } from "./adventure.component";
import { AdventureMobileComponent } from "./mobile/adventure-mobile.component";

@Component({
  selector: "app-index-adventure",
  template: `
    @if (!isMobile) {
      <app-adventure />
    } @else {
      <app-adventure-mobile />
    }
  `,
  imports: [AdventureComponent, AdventureMobileComponent],
})
export class AdventureIndexComponent {
  @HostBinding("class") cssClasses = "flex-grow d-flex";

  isMobile: boolean;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .pipe(takeUntilDestroyed())
      .subscribe((value) => (this.isMobile = value.matches));
  }
}
