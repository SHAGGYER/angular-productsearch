import { Component, OnInit } from '@angular/core';
import { fromEvent, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap
} from 'rxjs/operators';
import Products from "../../assets/products.json"

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const request = Products;

    const getContinents = (keys: any) => request.content.filter(x => (x.title.toLowerCase().indexOf(keys.toLowerCase().split(" ").reverse().join(" ")) > -1));

    const fakeContinentsRequest = (keys: any) =>
      of(getContinents(keys)).pipe(
        tap(_ => console.log(`API CALL at ${new Date()}`))
      );

    const element: any = document.getElementById('type-ahead')
    const outputElement: any = document.getElementById('output')

    fromEvent(element, 'keyup')
      .pipe(
        debounceTime(200),
        map((e: any) => e.target.value),
        distinctUntilChanged(),
        switchMap(fakeContinentsRequest),
        tap(c => (outputElement.innerText = c?.map(x => x.title).join('\n')))
      )
      .subscribe();
  }

}
