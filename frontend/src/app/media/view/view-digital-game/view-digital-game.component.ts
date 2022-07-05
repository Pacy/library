import { Component, Input } from '@angular/core';
import { SubCategory } from '../view-media/sub-category';

@Component({
  selector: 'app-view-digital-game',
  templateUrl: './view-digital-game.component.html',
  styleUrls: ['./view-digital-game.component.css','../view-media/sub-category.css']
})
export class ViewDigitalGameComponent implements SubCategory {
  @Input() data: any;

  constructor() { }

}