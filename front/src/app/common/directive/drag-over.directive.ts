import {Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[dragOver]'
})
export class DragOverDirective {
  private enterTarget;

  constructor(el: ElementRef) {
    el.nativeElement.ondragover = (event) => event.preventDefault();

    el.nativeElement.ondragenter = (event) => {
      this.enterTarget = event.target;
      event.stopPropagation();
      event.preventDefault();
      el.nativeElement.style.border = '5px dashed white';
      return false;
    };

    el.nativeElement.ondragleave = (event) => {
      if (event.target === this.enterTarget) {
        event.stopPropagation();
        event.preventDefault();
        el.nativeElement.style.border = 'none';
      }
    }

    el.nativeElement.ondrop = () => {
      el.nativeElement.style.border = 'none';
    }
  }
}
