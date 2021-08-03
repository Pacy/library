import { ChangeDetectorRef ,Component, OnInit, ViewChild } from '@angular/core';
import { Media } from 'src/app/models/media';
import { MediaSearchService } from 'src/app/services/search/media-search-service.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { mediaSearchOptions } from 'src/app/models/meadia-search-options';


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
  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  mediaTyp: string[];

  constructor(
    private searchService: MediaSearchService,
    private cdref: ChangeDetectorRef,
    private searchOption: mediaSearchOptions
  ) { }


  ngOnInit(): void {
    this.searchResult = this.searchService.getSearchResult();
    this.searchQuerry = this.searchService.getSearchedFor();
    this.mediaTyp = this.searchOption.getMediaTypes();
  }
  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<Media>(this.searchResult);
    this.dataSource.paginator = this.paginator;
  }
  ngAfterViewChecked() {
    this.cdref.detectChanges();
     }
     
  ngOnChanges() {
    this.searchResult = this.searchService.getSearchResult();
    this.searchQuerry = this.searchService.getSearchedFor();
  }

  ngDoCheck() {
    if (this.searchQuerry !== this.searchService.getSearchedFor()) {
       this.ngOnChanges();
    }
 }

  columnsToDisplay = ['resultNumber', 'title', 'mediaTyp2', 'expand'];
  expandedElement: Media | null;

  // return the appropriated svg depending on the medium type given
  // ToDO exchange/move hardcoded switchstatements/variables (media-serach-extended)
  // ToDO optional exchange mat-icons with better fitting svg
  getSvg(s: string) {
    console.log(s);
    switch (s) {
      case this.mediaTyp[1]: return "fas fa-book"; //"menu_book";
      case this.mediaTyp[2]: return "fas fa-compact-disc"; //"album";
      case this.mediaTyp[3]: return "das fa-gamepad"; //"videogame_asset";
      case this.mediaTyp[4]: return "fas fa-dice"; // "casino";
      case this.mediaTyp[5]: return "far fa-newspaper"; // "article";
      default: return "fas fa-bug"; //"error";
    }
  }
}