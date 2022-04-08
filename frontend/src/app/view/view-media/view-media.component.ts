import { Component, OnInit, ViewChildren, AfterViewInit, Type, ViewContainerRef, QueryList, ChangeDetectorRef } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { Media } from 'src/app/models/media';
import { ActivatedRoute } from "@angular/router"; // get value from url
import { MediaService } from 'src/app/services/media/media.service';
import { mediaSearchOptions } from 'src/app/models/meadia-search-options';
import { SubCategoryViewDirective } from './sub-category-view.directive';
import { ViewBookComponent } from '../view-book/view-book.component'
import { ViewDiscComponent } from '../view-disc/view-disc.component';
import { ViewDigitalGameComponent } from '../view-digital-game/view-digital-game.component';
import { ViewGameComponent } from '../view-game/view-game.component';
import { ViewMagazineComponent } from '../view-magazine/view-magazine.component';

@Component({
  selector: 'app-view-media',
  templateUrl: './view-media.component.html',
  styleUrls: ['./view-media.component.css'],
  entryComponents: [SubCategoryViewDirective]
})

export class ViewMediaComponent implements OnInit, AfterViewInit {
  
  @ViewChildren('SubCategoryView', { read: ViewContainerRef }) private SubCategoryViewDirective!: QueryList<any>;
  
  constructor(
    private route: ActivatedRoute,
    private searchService: MediaService,
    private searchOption: mediaSearchOptions,
   private changeDetector: ChangeDetectorRef
  ) {}

  medium$!: Observable<Media>; // data of the medium request from the backend
  svgClass; // class for the graphical representation of the medium type
  private mediaType: string[];

  private subscription: Subscription;

  ngOnInit(): void {
    this.mediaType = this.searchOption.getMediaTypes();
  }
  
  ngAfterViewInit() {
    this.loadMedium();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // unsure if not checking for attributes in the template would cause problems/error
  // note: currently unused 
  hasProp(object, name) {
    return object.hasOwnProperty(name);
  }

  // set the svg class according to the mediaType given
  setSvg(mediaType: string) {
   this.svgClass = this.searchOption.getSvg(mediaType);
  }

  // create the subCategoryView component matching the mediaType of the data received
  // optional: move switch statement to service and receive data from there
  loadSubCategoryView(data) {
    let subViewComponent: Type<any>;

    switch (data.mediaType) {
      case this.mediaType[1]: subViewComponent = ViewBookComponent; break;
      case this.mediaType[2]: subViewComponent = ViewDiscComponent; break;
      case this.mediaType[3]: subViewComponent = ViewDigitalGameComponent; break;
      case this.mediaType[4]: subViewComponent = ViewGameComponent; break;
      case this.mediaType[5]: subViewComponent = ViewMagazineComponent; break;
      default: console.log("error loadSubView"); return null;
    }
 
    this.SubCategoryViewDirective.forEach((sub: ViewContainerRef) => {
      let componentRef = sub.createComponent(subViewComponent);
      componentRef.instance.data = data;
    });
  }

  // load the data for the requested medium (by id) from the backend
  // and then set subCategoryView as well as the SVG appropriated to the pulled medium
  loadMedium() {
    // no need to unsubscribe from ActivatedRoute observable
    this.route.params.subscribe(params => {
      let id = params['id']; // get value from url
      this.subscription = this.searchService.getMediumExemplarByID(id)
        .subscribe((data) => {
          this.medium$ = of(data);
          this.changeDetector.detectChanges();
          this.loadSubCategoryView(data)
          this.setSvg(data.mediaType)
        })
    })
  }
}