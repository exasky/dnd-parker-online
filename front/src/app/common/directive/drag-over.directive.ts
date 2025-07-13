import { Directive, ElementRef } from "@angular/core";

@Directive({
  selector: "[dragOver]",
})
export class DragOverDirective {
  private enterTarget: EventTarget;

  constructor(el: ElementRef) {
    const htmlElement = el.nativeElement as HTMLElement;

    htmlElement.ondragover = (event) => event.preventDefault();

    htmlElement.ondragenter = (event) => {
      this.enterTarget = event.target;
      event.stopPropagation();
      event.preventDefault();
      if (!!localStorage.getItem("isDark")) {
        htmlElement.style.border = "5px dashed white";
      } else {
        htmlElement.style.border = "5px dashed black";
      }
      return false;
    };

    htmlElement.ondragleave = (event) => {
      if (event.target === this.enterTarget) {
        event.stopPropagation();
        event.preventDefault();
        htmlElement.style.border = "none";
      }
    };

    el.nativeElement.ondrop = () => {
      htmlElement.style.border = "none";
    };
  }
}
