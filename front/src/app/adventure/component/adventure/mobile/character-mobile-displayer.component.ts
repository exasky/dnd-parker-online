import {Component, HostBinding, Input, OnDestroy, OnInit} from "@angular/core";
import {Character} from "../../../model/character";

@Component({
  selector: 'app-character-mobile-displayer',
  templateUrl: './character-mobile-displayer.component.html',
  styleUrls: ['./character-mobile-displayer.component.scss']
})
export class CharacterMobileDisplayerComponent implements OnInit, OnDestroy {
  @HostBinding('class') cssClasses = 'd-flex flex-column h-100';

  @Input()
  character: Character;

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

}
