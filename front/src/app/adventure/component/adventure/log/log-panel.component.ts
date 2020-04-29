import {Component, HostBinding, Input} from "@angular/core";
import {AdventureLog, AdventureLogType} from "../../../model/adventure";

@Component({
  selector: 'app-log-panel',
  templateUrl: './log-panel.component.html',
  styleUrls: ['./log-panel.component.scss']
})
export class LogPanelComponent {
  @HostBinding('class') cssClasses = "d-flex flex-column";

  AdventureLogType = AdventureLogType;

  @Input()
  logs: AdventureLog[];
}
