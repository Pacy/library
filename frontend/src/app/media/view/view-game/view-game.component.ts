import { Component, Input } from '@angular/core';
import { SubCategory } from '../view-media/sub-category';

@Component({
  selector: 'app-view-game',
  templateUrl: './view-game.component.html',
  styleUrls: ['./view-game.component.css','../view-media/sub-category.css']
})
export class ViewGameComponent implements SubCategory {
  @Input() data: any;

  constructor() { }


}