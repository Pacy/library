import { Component, Input } from '@angular/core';
import { SubCategory } from '../view-media/sub-category';

@Component({
  selector: 'app-view-magazine',
  templateUrl: './view-magazine.component.html',
  styleUrls: ['./view-magazine.component.css']
})
export class ViewMagazineComponent implements SubCategory {
  @Input() data: any;

  constructor() { }

}