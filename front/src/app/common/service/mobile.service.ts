import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Injectable, Signal } from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs";

@Injectable({ providedIn: "root" })
export class MobileService {
  public isMobile: Signal<boolean>;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.isMobile = toSignal(this.breakpointObserver.observe([Breakpoints.XSmall]).pipe(map((b) => b.matches)));
  }
}
