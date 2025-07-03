import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Component, HostBinding, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
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
export class AdventureIndexComponent implements OnInit, OnDestroy {
  @HostBinding("class") cssClasses = "flex-grow d-flex";

  breakPointSubscription: Subscription;
  isMobile: boolean;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.breakPointSubscription = this.breakpointObserver.observe([Breakpoints.XSmall]).subscribe((value) => {
      this.isMobile = value.matches;
    });
  }

  ngOnDestroy(): void {
    this.breakPointSubscription.unsubscribe();
  }
}
