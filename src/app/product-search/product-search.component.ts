import { Component, OnInit } from '@angular/core';
import {delay, exhaustMap, from, fromEvent, interval, mergeMap, Observable, of, take} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  tap
} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {Product, SearchProductResponse} from "../../../products";
import {debounce} from 'lodash';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent implements OnInit {

  constructor(private http: HttpClient) { }

  private data: SearchProductResponse | undefined;
  public page: number = 1
  public parsedData: Product[] = []
  public shownData: Product[] = []
  public loading: boolean = false;
  public loaded: boolean = false;
  public searchText: string = "";
  public maxPages: number = 0;
  public nextDisabled: boolean = false;
  public prevDisabled: boolean = true;

  public paginate(next: boolean) {
    this.loading = true;

    if (next) {

      this.page++

      this.onNextPage()

      this.nextDisabled = this.page + 1 > this.maxPages;
      this.prevDisabled = false
    } else {

      this.page--
      this.onPreviousPage()

      this.nextDisabled = this.page + 1 > this.maxPages;
      this.prevDisabled = this.page - 1 === 0;

    }

    console.log(this.page, this.maxPages)

  }


  public onNextPage = debounce(() =>
  {
    this.onViewPage()
  }, 1000)

  onPreviousPage = debounce(() => {
    this.onViewPage()
  }, 1000)

  resetData(): void {
    this.searchText = ""
    this.shownData = []
    this.page = 1
  }

  onViewPage(): void {
    this.shownData = this.parsedData.slice((this.page - 1) * 10, ((this.page - 1) * 10) + 10)
    this.loading = false;

  }

  getProducts(): Observable<SearchProductResponse> {
    if (!this.loaded) {
      this.loaded = true;
      this.loading = true;
      return this.http.get<SearchProductResponse>("assets/products.json")
    }

    return of(this.data)
  }

  loadItems = () => {
    const element: HTMLElement = document.getElementById('type-ahead')

    fromEvent(element, 'keyup')
      .pipe(
        debounceTime(200),
        map((e: any) => e.target.value),
        distinctUntilChanged(),
        exhaustMap((keys: string) => this.getProducts().pipe(
          map((data: SearchProductResponse) => {
            this.data = data;
            this.loading = false

            const words = keys.toLowerCase().split(" ");

            return data.content.filter((x) => {
              const title = x.title.toLowerCase().split(" ");
              for (let word of title) {
                if (words.includes(word)) return true
              }

              if (x.title.toLowerCase().indexOf(keys.toLowerCase()) > -1) return true
              else if (x.title.toLowerCase().indexOf(keys.toLowerCase().split(" ").reverse().join(" ")) > -1) return true

              return false;
            })

          }),
        )),
        tap((data: Product[]) => {
          this.page = 1
          this.maxPages = Math.ceil(data.length / 10)
          this.parsedData = data
          this.onViewPage()
        }),
  )
      .subscribe();
  }

  ngOnInit(): void {
    this.loadItems()

  }

}
