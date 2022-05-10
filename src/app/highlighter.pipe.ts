import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlighter'
})
export class HighlighterPipe implements PipeTransform {

  transform(value: any, args: any, type:string): unknown {
    if(!args) return value;

    console.log(args)
    console.log(value)
    const values = []

    if(type==='full'){
      const re = new RegExp("\\b("+args+"\\b)", 'igm');
      value= value.replace(re, '<span class="highlighted-text">$1</span>');
    }
    else{

      const argsArray = args.toLowerCase().split(" ")
      for (let arg of argsArray) {
        const includes = value.toLowerCase().split(" ").includes(arg)

        if (includes && arg) {
          const re = new RegExp(arg, 'igm');
          value = value.replace(re, '<span class="highlighted-text">$&</span>');
        }

      }

      const re = new RegExp(args, 'igm');
      value = value.replace(re, '<span class="highlighted-text">$&</span>');

    }

    return value;
  }

}
