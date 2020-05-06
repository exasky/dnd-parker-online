import {DoCheck, OnChanges, SimpleChanges} from "@angular/core";

export class AuditableComponent implements DoCheck, OnChanges {
  ngDoCheck(): void {
    // console.log('[' + this.constructor.name + '] ngDoCheck')
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('[' + this.constructor.name + '] ngOnChanges: ');
    console.log('[' + this.constructor.name + '] ngOnChanges: ' + JSON.stringify(changes));
  }
}
