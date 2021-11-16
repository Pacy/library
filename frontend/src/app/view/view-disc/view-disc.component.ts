import { Component, Input } from '@angular/core';
import { SubCategory } from '../view-media/sub-category';

@Component({
  selector: 'app-view-disc',
  templateUrl: './view-disc.component.html',
  styleUrls: ['./view-disc.component.css']
})
export class ViewDiscComponent implements SubCategory {
  @Input() data: any;

  constructor() { }

}