import { Component, OnInit, ViewChildren, AfterViewInit, Type, ViewContainerRef, QueryList, ChangeDetectorRef } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { Media } from 'src/app/models/media';
import { ActivatedRoute, Router } from "@angular/router"; // get value from url
import { MediaService } from 'src/app/services/media/media.service';
import { mediaSearchOptions } from 'src/app/models/meadia-search-options';
import { SubCategoryViewDirective } from './sub-category-view.directive';
import { ViewBookComponent } from '../view-book/view-book.component'
import { ViewDiscComponent } from '../view-disc/view-disc.component';
import { ViewDigitalGameComponent } from '../view-digital-game/view-digital-game.component';
import { ViewGameComponent } from '../view-game/view-game.component';
import { ViewMagazineComponent } from '../view-magazine/view-magazine.component';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-view-media',
  templateUrl: './view-media.component.html',
  styleUrls: ['./view-media.component.css'],
  entryComponents: [SubCategoryViewDirective]
})

export class ViewMediaComponent implements OnInit, AfterViewInit {
  
  @ViewChildren('SubCategoryView', { read: ViewContainerRef }) private SubCategoryViewDirective!: QueryList<any>;
  waitingOnDeleteRespond: boolean = true;
  deleteSuccesful: boolean = true;
  
  constructor(
    private route: ActivatedRoute,
    private searchService: MediaService,
    private searchOption: mediaSearchOptions,
   private changeDetector: ChangeDetectorRef,
   private modalService: NgbModal,
   private router: Router
  ) {}

  medium$!: Observable<Media>; // data of the medium request from the backend
  svgClass; // class for the graphical representation of the medium type
  private mediaType: string[];
  private id; //id of the object to view. 

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
      this.id = params['id']; // get value from url
      this.subscription = this.searchService.getMediumByID(this.id)
        .subscribe((data) => {
          this.medium$ = of(data);
          this.changeDetector.detectChanges();
          this.loadSubCategoryView(data)
          this.setSvg(data.mediaType)
        })
    })
  }

  // confirmed delete request
  deleteConfirmation(content){
    this.modalService.open(content, {centered:true})
    this.delete();
    // this.modalService.dismissAll();
  }

  // call media service to try to delete currently viewed media
  delete(){
    this.searchService.deleteMediumByID(this.id)
    .subscribe(
      (res) => {
        console.log(res);
        this.deleteSuccessful();
      },
      (err) => {
        this.deleteFailed(err);
      }
    )
  }

  clickMethod(name: string) {
    if(confirm("Are you sure to delete "+name)) {
      console.log("Implement delete functionality here");
    }
  }

  confirmDeletion(content) {
    this.modalService.open(content, { centered: true });
    this.waitingOnDeleteRespond=true;
  }

  deleteSuccessful=() =>{
    this.waitingOnDeleteRespond=false;
    this.deleteSuccesful= true;
    document.getElementById('deleteMessage').innerText = ' Deletion succesful!';
  }


  deleteFailed = (error) =>{
    this.waitingOnDeleteRespond=false;
    this.deleteSuccesful= false;
    document.getElementById('deleteMessage').textContent = ` Deletion failed! + ${error}`;

  }

  closeAllModal(){
    this.modalService.dismissAll();
    // optional redirect here. this is currently only available to be called on modal reporting the delete status. 
    // but the request could also be an error at the moment. 
    // this.router.navigate();

  }
}