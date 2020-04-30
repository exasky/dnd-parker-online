export class StringUtils {
  static isFilter(filterText: string[], text: string[]) {
    return filterText.every(wordFilter => text.some(word => word.indexOf(wordFilter) !== -1));
  }
}
