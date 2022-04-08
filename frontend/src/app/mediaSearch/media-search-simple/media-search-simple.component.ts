import { Component, OnInit } from '@angular/core';
import { MediaService } from 'src/app/services/media/media.service';


@Component({
  selector: 'app-media-search-simple',
  templateUrl: './media-search-simple.component.html',
  styleUrls: ['./media-search-simple.component.css']
})
export class MediaSearchSimpleComponent implements OnInit {

  constructor(
    private searchService: MediaService
  ) { }

  ngOnInit(): void {
  }
  
  onSubmit(data) {
    //toDO check user input (security wise, not syntactic)
    this.searchService.searchFor(data.value);
  }
}
