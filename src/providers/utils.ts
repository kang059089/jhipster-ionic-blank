import {Injectable} from "@angular/core";

@Injectable()
export class Utils {

  constructor() {
  }

  /**
   * 把url中的双斜杠替换为单斜杠
   * 如:http://localhost:8080//api//demo.替换后http://localhost:8080/api/demo
   * @param url
   * @returns {string}
   */
  static formatUrl(url: string = ''): string {
    let index = 0;
    if (url.startsWith('http')) {
      index = 7
    }
    return url.substring(0, index) + url.substring(index).replace(/\/\/*/g, '/');
  }
}
