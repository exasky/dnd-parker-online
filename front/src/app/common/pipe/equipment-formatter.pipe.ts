import {Pipe, PipeTransform} from "@angular/core";
import {CapitalizePipe} from "./capitalize.pipe";

@Pipe({name: 'equipmentFormat'})
export class EquipmentFormatterPipe implements PipeTransform {
  constructor(private capitalize: CapitalizePipe) {
  }
  transform(value: string): any {
    if (!value) return '';
    return value.split('_').map(val => this.capitalize.transform(val)).join(' ');
  }
}
