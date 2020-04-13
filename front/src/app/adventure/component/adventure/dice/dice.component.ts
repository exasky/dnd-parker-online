import {Component, ElementRef, Input, ViewChild} from "@angular/core";

/**
 * Inspired by https://codesandbox.io/s/animated-3d-dice-roll-hormj?file=/styles.css:1710-2273
 */
@Component({
  selector: 'app-dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.scss']
})
export class DiceComponent {
  @ViewChild('dice', {read: ElementRef}) diceElement: ElementRef;

  @Input()
  diceType: string;

  constructor() {
  }

  set value(value: number) {
    this.toggleClasses(this.diceElement.nativeElement);
    this.diceElement.nativeElement.dataset.roll = value;
  }

  rollDice(): number {
    this.toggleClasses(this.diceElement.nativeElement);
    this.diceElement.nativeElement.dataset.roll = this.getRandomNumber(1,6);
    return this.diceElement.nativeElement.dataset.roll;
  }

  toggleClasses(die) {
    die.classList.toggle("odd-roll");
    die.classList.toggle("even-roll");
  }

  getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
