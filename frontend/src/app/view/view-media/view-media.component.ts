import { Component, OnInit, ViewChild, AfterViewInit, Type, ComponentFactoryResolver } from '@angular/core';
import { Observable } from 'rxjs';
import { Media } from 'src/app/models/media';
import { ActivatedRoute, ParamMap } from "@angular/router"; // get value from url
import { MediaSearchService } from 'src/app/services/search/media-search-service.service';
import { mediaSearchOptions } from 'src/app/models/meadia-search-options'; //todo #3872
import { SubCategoryViewDirective } from './sub-category-view.directive';
import { SubCategory } from './sub-category';
import { ViewBookComponent } from '../view-book/view-book.component'
import { ViewDiscComponent } from '../view-disc/view-disc.component';
import { ViewDigitalGameComponent } from '../view-digital-game/view-digital-game.component';
import { ViewGameComponent } from '../view-game/view-game.component';
import { ViewMagazineComponent } from '../view-magazine/view-magazine.component';

@Component({
  selector: 'app-view-media',
  templateUrl: './view-media.component.html',
  styleUrls: ['./view-media.component.css']
})

export class ViewMediaComponent implements OnInit, AfterViewInit {

  @ViewChild(SubCategoryViewDirective, { static: false }) SubCategoryView!: SubCategoryViewDirective;

  constructor(
    private route: ActivatedRoute,
    private searchService: MediaSearchService,
    private searchOption: mediaSearchOptions, //todo #3872
    private resolver: ComponentFactoryResolver // get value from url
  ) { }
  medium$!: Observable<Media>; // selected medium

  mediaTyp: string[];//todo #3872

  subCategory: string = "<app-home></app-home>"; //contains html to load the sub category

  ngOnInit(): void {

    this.mediaTyp = this.searchOption.getMediaTypes();//todo #3872

    this.route.params.subscribe(params => {
      let id = params['id']; // get value from url
      this.medium$ = this.searchService.getMediumExemplarByID(id);
    });
  }

  ngAfterViewInit() {
    this.medium$.subscribe(val => this.loadSubCategoryView(val));
  }

  //unsure if not checking for attributes in the template would cause problems/error
  //currently unused. 
  hasProp(object, name) {
    return object.hasOwnProperty(name);
  }

  //copied from media-search-result
  //todo #3872 move both to a different file to import in both components
  getSvg(s: string) {
    switch (s) {
      case this.mediaTyp[1]: return "fas fa-book"; //"menu_book";
      case this.mediaTyp[2]: return "fas fa-compact-disc"; //"album";
      case this.mediaTyp[3]: return "fas fa-gamepad"; //"videogame_asset";
      case this.mediaTyp[4]: return "fas fa-dice"; // "casino";
      case this.mediaTyp[5]: return "far fa-newspaper"; // "article";
      default: return "fas fa-bug"; //"error";
    }
  }

  loadSubCategoryView(value) {
    let subViewComponent: Type<any>;

    switch (value.mediaTyp) {
      case this.mediaTyp[1]: subViewComponent = ViewBookComponent; break; 
      case this.mediaTyp[2]: subViewComponent = ViewDiscComponent; break; 
      case this.mediaTyp[3]: subViewComponent = ViewDigitalGameComponent; break;
      case this.mediaTyp[4]: subViewComponent = ViewGameComponent; break; 
      case this.mediaTyp[5]: subViewComponent = ViewMagazineComponent; break; 
      default: console.log("error loadSubView"); return null; 
    }

    const viewContainerRef = this.SubCategoryView.viewContainerRef;
    viewContainerRef.clear();
    const factory = this.resolver.resolveComponentFactory(subViewComponent)

    //setTimeOut to prevent ExpressionChangedAfterItHasBeenCheckedError
    //not ideal way refer to https://hackernoon.com/everything-you-need-to-know-about-the-expressionchangedafterithasbeencheckederror-error-e3fd9ce7dbb4
    //todo test & improve it when backend conenction established
    setTimeout(() => {
      let componentRef = viewContainerRef.createComponent<SubCategory>(factory);
      componentRef.instance.data = value;
    })
  }
}
