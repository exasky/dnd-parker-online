import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'sort'})
export class SortPipe implements PipeTransform {
  transform(value: any[], fieldPath: string): any {
    const splitPath = fieldPath.split('.');
    return value.sort((a,b) => this.getValue(a, splitPath) < this.getValue(b, splitPath) ? -1 : 1);
  }

  private getValue(value: any, path: string[]) {
    let returnValue = value;
    path.forEach(pathElement => returnValue = returnValue[pathElement]);
    return returnValue;
  }
}
