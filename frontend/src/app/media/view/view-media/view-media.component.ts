import { Component, OnInit, ViewChildren, AfterViewInit, Type, ViewContainerRef, QueryList, ChangeDetectorRef } from '@angular/core';
import { Observable, of, Subscription, take } from 'rxjs';
import { Media } from 'src/app/models/media';
import { ActivatedRoute, Router } from "@angular/router"; // get value from url
import { MediaService } from 'src/app/services/media/media.service';
import { MediaHelper } from '../../../services/media/media-helper'
import { SubCategoryViewDirective } from './sub-category-view.directive';
import { ViewBookComponent } from '../view-book/view-book.component'
import { ViewDiscComponent } from '../view-disc/view-disc.component';
import { ViewDigitalGameComponent } from '../view-digital-game/view-digital-game.component';
import { ViewGameComponent } from '../view-game/view-game.component';
import { ViewMagazineComponent } from '../view-magazine/view-magazine.component';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/alert';
import { AuthentificationService } from 'src/app/services/user/authentification.service';


@Component({
  selector: 'app-view-media',
  templateUrl: './view-media.component.html',
  styleUrls: ['./view-media.component.css'],
  entryComponents: [SubCategoryViewDirective]
})

export class ViewMediaComponent implements OnInit, AfterViewInit {

  @ViewChildren('SubCategoryView', { read: ViewContainerRef }) private SubCategoryViewDirective!: QueryList<any>;
  waitingOnDeleteRespond: boolean = true;
  authorised: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private searchService: MediaService,
    private searchOption: MediaHelper,
    private changeDetector: ChangeDetectorRef,
    private modalService: NgbModal,
    // private router: Router
    private alertService: AlertService,
    private auth: AuthentificationService
  ) { }

  medium$!: Observable<Media>; // data of the medium request from the backend
  svgClass; // class for the graphical representation of the medium type
  private mediaType: string[];
  private id; //id of the object to view. 

  foundMedium: boolean;

  // private subscription: Subscription;

  ngOnInit(): void {
    this.mediaType = this.searchOption.getMediaTypes();

    this.auth.isLoggedInObservable
      .pipe(take(1))
      .subscribe(val => this.authorised = val);
  }

  ngAfterViewInit() {
    this.loadMedium();
  }
  ngOnDestroy() {
    // this.subscription.unsubscribe();
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
      // this.subscription = 
      this.searchService.getMediumByID(this.id)
        .subscribe({
          next: (data) => {
            this.foundMedium = true;
            this.polishServerData(data);
            this.medium$ = of(data);

            this.changeDetector.detectChanges();
            this.loadSubCategoryView(data)
            this.setSvg(data.mediaType)
          },
          error: (err) => {
            this.foundMedium = false;
            // optional adjust error message, so that the user sees less technical details (including api url) and have a better respond
            // have to check what kind of error beside 404 (not found), 500 (internal server error, i.e cast error) can appear here otherwise
            // 503 service unavailable, 
            this.alertService.error("Error: No medium could be found with this id " + err, { autoClose: false, keepAfterRouteChange: false });
          },
          complete: () => console.log("getMediumByID Observable completed")
        })
    })
  }

  // confirmed delete request
  deleteConfirmation(content) {
    this.modalService.open(content, { centered: true })
    this.delete();
    // this.modalService.dismissAll();
  }

  // call media service to try to delete currently viewed media
  delete() {
    this.searchService.deleteMediumByID(this.id)
      .subscribe({
        next: (res) => {
          console.log(res)
          this.deleteSuccessful();
        },
        error: (e) => {
          this.deleteFailed(e);
        },
        complete: () => {
          console.log('delete medium observer got a complete notification');
        }
      })
  }

  /**
   * opens the modal, that display a loading message, till the server responds
   * 
   */
  confirmDeletion(content) {
    this.modalService.open(content, { centered: true });
    this.waitingOnDeleteRespond = true;
  }
 
  /**
  * call the alert service to display a message about the succesful deletion, and close all open modals 
  */
  deleteSuccessful = () => {
    this.waitingOnDeleteRespond = false;
    this.alertService.success("Deletion succesful!", { autoClose: false, keepAfterRouteChange: false });
    this.closeAllModal();
  }

  /**
  * call the alert service to display an error message about the failed attempt to delete the medium , and close all open modals 
  */
  deleteFailed = (error) => {
    this.waitingOnDeleteRespond = false;
    this.alertService.error(`Deletion failed! + ${error}`, { autoClose: false, keepAfterRouteChange: false });
    this.closeAllModal();
  }

  /**
  * close all open modals
  */
  closeAllModal() {
    this.modalService.dismissAll();
    // optional redirect here. this is currently only available to be called on modal reporting the delete status. 
    // but the request could also be an error at the moment. 
    // this.router.navigate();
  }

  /**
  * polish the received data of the medium from the backend
  * 1) update the releaseYear value, if it is not a year, but in milliseconds  since 1970
  *    (assuming that 3 or 4 digits will never be later option. 
  *     3/4 digits would only be 1.6sec - 2.8 mins from 1st of 1970, which would be a weird creation time.
  *     Therefore going with this option till the database is more uniformly)
  */
  polishServerData(data){
    const releaseYear = data["releaseYear"];
    const dateLength = (Math.ceil(Math.log10(releaseYear + 1)));
    if (!(dateLength == 4 || dateLength == 3)){
      data["releaseYear"] = new Date(releaseYear).getFullYear();
    }
  }
}