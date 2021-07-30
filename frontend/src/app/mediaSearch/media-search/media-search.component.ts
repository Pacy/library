import { Component, Input, OnInit } from '@angular/core';
import { MediaSearchService } from 'src/app/services/search/media-search-service.service';

@Component({
  selector: 'app-media-search',
  templateUrl: './media-search.component.html',
  styleUrls: ['./media-search.component.css']
})
export class MediaSearchComponent implements OnInit {


  constructor(
    private searchService: MediaSearchService
  ) { }

  ngOnInit(): void {
    this.searchService.setSearched(false);
  }
  extendedSearch = false;

  toggleExtendedSearch() {
    this.extendedSearch ? this.extendedSearch = false
      : this.extendedSearch = true;
  }

  getSearchStatus() {
    return this.searchService.getSearched();
  }
}
