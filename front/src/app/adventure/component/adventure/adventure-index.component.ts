import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {Component, HostBinding, OnDestroy, OnInit} from "@angular/core";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-index-adventure',
  template: `
    <app-adventure *ngIf="isMobile === false"></app-adventure>
    <app-adventure-mobile *ngIf="isMobile === true"></app-adventure-mobile>
  `
})
export class AdventureIndexComponent implements OnInit, OnDestroy {
  @HostBinding('class') cssClasses = "flex-grow d-flex";

  breakPointSubscription: Subscription;
  isMobile: boolean;

  constructor(private breakpointObserver: BreakpointObserver) {
  }

  ngOnInit(): void {
    this.breakPointSubscription = this.breakpointObserver.observe([Breakpoints.XSmall]).subscribe(value => {
      this.isMobile = value.matches;
    });
  }

  ngOnDestroy(): void {
    this.breakPointSubscription.unsubscribe();
  }
}
