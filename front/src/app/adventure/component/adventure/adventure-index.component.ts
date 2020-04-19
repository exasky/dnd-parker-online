import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {Component, HostBinding, OnInit} from "@angular/core";

@Component({
  selector: 'app-index-adventure',
  template: `
    <app-adventure *ngIf="isMobile === false"></app-adventure>
    <app-adventure-mobile *ngIf="isMobile === true"></app-adventure-mobile>
  `
})
export class AdventureIndexComponent implements OnInit {
  @HostBinding('class') cssClasses = "flex-grow d-flex";

  isMobile: boolean;

  constructor(private breakpointObserver: BreakpointObserver) {
  }

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.XSmall]).subscribe(value => {
      this.isMobile = value.matches;
    })
  }
}
