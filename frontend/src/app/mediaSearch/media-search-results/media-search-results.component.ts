import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Media } from 'src/app/models/media';
import { MediaService } from 'src/app/services/media/media.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { mediaSearchOptions } from 'src/app/models/meadia-search-options';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-media-search-results',
  templateUrl: './media-search-results.component.html',
  styleUrls: ['./media-search-results.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MediaSearchResultsComponent implements OnInit {
  searchResult: Media[];
  searchQuerry: string;
  //dataSource;
  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // subscription necessary as we have to unsubscribe from a subject on destory
  // although may have to change this a bit as this is one delivery per request only
  subscription: Subscription;

  constructor(
    private searchService: MediaService,
    private cdref: ChangeDetectorRef,
    private searchOption: mediaSearchOptions
  ) {
    // this.searchResult = searchService.searchResult;
    // console.log("searchResult: ", this.searchResult)
    this.subscription = this.searchService.getData().subscribe({
      next: data => {
        this.searchResult = data;
        this.dataSource = new MatTableDataSource<Media>(this.searchResult);
        this.dataSource.paginator = this.paginator;
      },
      error: (e) => console.log(e),
      complete: () => console.log("this is never called")
    });
  }


  ngOnInit(): void {
    // console.log("on Init", this.searchResult, this.searchQuerry)
  }
  ngAfterViewInit() {
    // this.dataSource = new MatTableDataSource<Media>(this.searchResult);
    // this.dataSource.paginator = this.paginator;
  }
  ngAfterViewChecked() {
    // this.cdref.detectChanges();
  }

  ngOnChanges() {

    this.searchResult = this.searchService.getSearchResult();
    this.searchQuerry = this.searchService.getSearchedForString();
    // console.log("ngonChange", this.searchResult,this.searchQuerry)
    // this.cdref.detectChanges();
  }

  ngDoCheck() {
    if (this.searchQuerry !== this.searchService.getSearchedForString()) {
      // console.log("ngDocheck", this.searchQuerry, this.searchService.getSearchedForString())
      this.ngOnChanges();
    }
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  columnsToDisplay = ['resultNumber', 'title', 'mediaTyp2', 'expand'];
  expandedElement: Media | null;

  // return the appropriated svg class depending on the medium type given
  // ToDO optional exchange mat-icons with better fitting svg
  getSvg(mediaType: string) {
    return this.searchOption.getSvg(mediaType);
  }

}