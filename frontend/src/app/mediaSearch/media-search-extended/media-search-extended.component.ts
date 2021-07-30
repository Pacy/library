import { Component, OnInit } from '@angular/core';
import { mediaSearchOptions } from 'src/app/models/meadia-search-options';
import { MediaSearchService } from 'src/app/services/search/media-search-service.service';

@Component({
  selector: 'app-media-search-extended',
  templateUrl: './media-search-extended.component.html',
  styleUrls: ['./media-search-extended.component.css']
})
export class MediaSearchExtendedComponent implements OnInit {

  constructor(
    private searchService: MediaSearchService,
    private searchOption: mediaSearchOptions
  ) { }

  searchFields = [];
  languages = [];
  genres = []
  mediaTypes = [];
  searchOperators = [];
  
  selectedLanguage = ""
  selectedGenre = "";
  selectedMediaType ="";
  searchField0 = "";
  searchOperator1 = "";
  searchField1 = "";
  searchOperator2 = "";
  searchField2 = "";


  ngOnInit(): void {
    this.searchFields = this.searchOption.getSearchFields();
    this.languages = this.searchOption.getLanguages();
    this.genres = this.searchOption.getGenres();
    this.mediaTypes = this.searchOption.getMediaTypes();
    this.searchOperators = this.searchOption.getSearchOperators();

    this.selectedLanguage = this.languages[0];
    this.selectedGenre = this.genres[0];
    this.selectedMediaType = this.mediaTypes[0];
    this.searchField0 = this.searchFields[0];
    this.searchOperator1 = this.searchOperators[0];
    this.searchField1 = this.searchFields[0];
    this.searchOperator2 = this.searchOperators[0];
    this.searchField2 = this.searchFields[0];
  }

  search(data) {
    this.searchService.searchFor(data);
  }
}
