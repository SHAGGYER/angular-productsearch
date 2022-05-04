import { Component, OnInit } from '@angular/core';
import {fromEvent, of, take} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap
} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {SearchProductResponse} from "../../../products";

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent implements OnInit {

  private data: SearchProductResponse | undefined;
  constructor(private http: HttpClient) { }
  public page: number = 1
  public parsedData: any[] = []
  private subscription: any = null;
  public shownData: any[] = []

  onNextPage(): void {
    this.page++
    this.onViewPage(this.parsedData)
  }

  onPreviousPage(): void {
    this.page--
    this.onViewPage(this.parsedData)
  }

  onViewPage(data: any[]): void {
    this.shownData = data.slice((this.page - 1) * 10, ((this.page - 1) * 10) + 10)
  }

  getContinents = (keys: any) => {
    if (!this.data) {
      this.http.get<SearchProductResponse>("assets/products.json").subscribe(data => this.data = data)
    }

    if (this.data) {
      const data = this.data.content!.filter((x) => (x.title.toLowerCase().indexOf(keys.toLowerCase().split(" ").reverse().join(" ")) > -1));
      return data
    }

    return []
  }

  requestProducts = (keys: any) => {
    return of(this.getContinents(keys)).pipe(
      tap(_ => console.log(`API CALL at ${new Date()}`))
    );
  }

  loadItems = () => {
    const element: any = document.getElementById('type-ahead')
    const outputElement: any = document.getElementById('output')

    this.subscription = fromEvent(element, 'keyup')
      .pipe(
        debounceTime(200),
        map((e: any) => e.target.value),
        distinctUntilChanged(),
        switchMap(this.requestProducts),
        tap((c: any) => {
          this.page = 1
          this.parsedData = c
          this.onViewPage(c)
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.loadItems()

  }

}
