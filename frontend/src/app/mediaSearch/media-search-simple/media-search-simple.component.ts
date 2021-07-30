import { Component, OnInit } from '@angular/core';
import { MediaSearchService } from 'src/app/services/search/media-search-service.service';


@Component({
  selector: 'app-media-search-simple',
  templateUrl: './media-search-simple.component.html',
  styleUrls: ['./media-search-simple.component.css']
})
export class MediaSearchSimpleComponent implements OnInit {

  constructor(
    private searchService: MediaSearchService
  ) { }

  ngOnInit(): void {
  }
  
  onSubmit(data) {
    //toDO check user input (security wise, not syntactic)
    this.searchService.searchFor(data.value);
  }
}
