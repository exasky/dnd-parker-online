import {Component, Inject, OnDestroy, OnInit, QueryList, ViewChildren} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CharacterItem} from "../../../model/character";
import {GmService} from "../../../service/gm.service";
import {Dice} from "../../../model/dice";
import {Subscription} from "rxjs";
import {DiceComponent} from "./dice.component";

@Component({
  selector: 'app-dice-dialog',
  templateUrl: './dice-dialog.component.html',
})
export class DiceDialogComponent implements OnInit, OnDestroy {

  @ViewChildren('diceCmp') components: QueryList<DiceComponent>;

  dices: Dice[];
  selectedDices: Dice[] = [];

  diceWSObs: Subscription;

  constructor(public dialogRef: MatDialogRef<DiceDialogComponent>,
              private gmService: GmService,
              @Inject(MAT_DIALOG_DATA) public data: CharacterItem) {
  }

  ngOnInit(): void {
    this.gmService.getAllDices().subscribe(dices => this.dices = dices);
  }

  ngOnDestroy(): void {
    this.diceWSObs.unsubscribe();
  }

  addToDiceList(dice: Dice) {
    this.selectedDices.push(dice);
  }

  removeDiceFromList(dice: Dice) {
    this.selectedDices.splice(this.selectedDices.indexOf(dice), 1);
  }

  rollDices() {
    this.components.forEach(cmp => {
      cmp.rollDice();
    })
  }
}
