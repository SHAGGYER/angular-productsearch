import { Pipe, PipeTransform } from '@angular/core';
import {temporaryAllocator} from "@angular/compiler/src/render3/view/util";

@Pipe({
  name: 'highlighter'
})
export class HighlighterPipe implements PipeTransform {

  transform(value: any, args: any, type:string): unknown {
    if(!args) return value;
    let tempValue: string = ""

    const values: string[] = []

    if(type==='full'){
      const re = new RegExp("\\b("+args+"\\b)", 'igm');
      value= value.replace(re, '<span class="highlighted-text">$1</span>');
    }
    else{

      const argsArray = args.toLowerCase().split(" ")
      for (let arg of argsArray) {

        const includes = value.toLowerCase().match(arg)

        if (includes && arg) {
          const re = new RegExp(arg, 'igm');
          value = value.replace(re, '_$&_');
        }

      }
    }

    const regex = new RegExp(/_(.*?)_/, "igm")
    value = value.replaceAll(regex, '<span class="highlighted-text">$1</span>')

    return value;
  }

}
