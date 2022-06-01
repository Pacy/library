import { Component, Input} from '@angular/core';
import {SubCategory} from '../view-media/sub-category'
@Component({
  selector: 'app-view-book',
  templateUrl: './view-book.component.html',
  styleUrls: ['./view-book.component.css','../view-media/sub-category.css']
})
export class ViewBookComponent implements SubCategory {
  @Input() data: any;
  
  constructor() {
   }
}
