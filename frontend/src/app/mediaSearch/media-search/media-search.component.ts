import { Component, Input, OnInit } from '@angular/core';
import { MediaService } from 'src/app/services/media/media.service';

@Component({
  selector: 'app-media-search',
  templateUrl: './media-search.component.html',
  styleUrls: ['./media-search.component.css']
})
export class MediaSearchComponent implements OnInit {


  constructor(
    private searchService: MediaService
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
