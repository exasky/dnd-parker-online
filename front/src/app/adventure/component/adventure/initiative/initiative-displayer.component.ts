import { CommonModule } from "@angular/common";
import { Component, computed, HostBinding, input, Input } from "@angular/core";
import { GetCharacterImagePipe } from "../../../../common/utils/card-utils";
import { Initiative } from "../../../model/adventure";

@Component({
  selector: "app-initiative-displayer",
  templateUrl: "./initiative-displayer.component.html",
  styles: [".selected {border: white 3px solid;}"],
  imports: [CommonModule, GetCharacterImagePipe],
})
export class InitiativeDisplayerComponent {
  @HostBinding("class") cssClasses = "d-flex justify-content-center align-items-center flex-wrap";

  initiatives = input.required<Initiative[]>();
  sortedInitiatives = computed(() => this.initiatives().sort((a, b) => a.number - b.number));

  @Input()
  currentInitiative: Initiative;
}
