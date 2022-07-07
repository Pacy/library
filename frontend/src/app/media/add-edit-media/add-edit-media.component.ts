import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/alert';
import { MediaHelper } from 'src/app/services/media/media-helper';
import { MediaService } from '../../services/media/media.service';
import { germanAgeRatingValidator, minMaxRelationValidator, urlValidator } from './customFormValidator'


@Component({
  selector: 'app-add-edit-media',
  templateUrl: './add-edit-media.component.html',
  styleUrls: ['./add-edit-media.component.css']
})
export class AddMediaComponent implements OnInit {
  mediaForm!: FormGroup;

  isAddMode: boolean;
  id: string;


  constructor(
    private mediaService: MediaService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private mediaHelper: MediaHelper,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.createForm();

    // get values from backend if edit/:id was called
    if (!this.isAddMode) {
      this.mediaService.getMediumByID(this.id)
        .subscribe({
          next: (data) => this.updateForm(data),
          error: (e) => console.log(e),
          complete: () => console.log("getMediumById Observer completed")
        })
    }

  }

  /**
   * create the reactive form for mediums 
   * (for create and edit mediums)
   */
  createForm() {
    this.mediaForm = this.fb.group({
      // common base for all mediatypes
      base: this.fb.group({
        ean: ["", Validators.minLength(13)], //?number
        title: ["", Validators.required],// string
        releaseYear: ["", Validators.max(2300)],//? number
        publisher: [[]],//? string[]
        description: [],//? string
        genre: [],//? string
        mediaType: [],//? string
        language: [],//? string
        // currently obsolete tags: [],//? string[]
        previewImageLink: ["", urlValidator()],//? string
        externalProductLink: ["", urlValidator()],//? string
      }),
      //book formGroup
      book: this.fb.group({
        // isbn: [],// number; same number as ean 
        authors: [[]],//?  string[];
        pages: ["", [Validators.min(1), Validators.max(23000)]],//? number;
        tableOfContentLink: ["", urlValidator()],//? string; //link to a picture of the page of content
      }),

      //Cd, dvd formGroup
      disc: this.fb.group({
        fsk: ['', germanAgeRatingValidator()],//? number;
        tableOfContentLink: ["", urlValidator()],//? string; //link to a picture of the page of content
        duration: ["", Validators.min(0)],//?  number; //in minutes
        involvedPerson: [[]],//? string[]; // singers, actors,...    
      }),

      //digital Game formGroup
      digitalGame: this.fb.group({
        developers: [[]],//  string[]; // in case multiple developers 
        usk: ['', germanAgeRatingValidator()],// number;
        // tableOfContentLink:[],//? not really matching for digital games
        platform: [],// string;
      }),

      //physical games formGroup
      game: this.fb.group({
        minAge: ["", Validators.min(0)],//?  number; //minimum advised age
        playTime: ["", Validators.min(0)],//?  number; //either in minutes or a string to handle later
        playersMinimum: ["", Validators.min(1)],//? number; //minimum players needed
        playersMaximum: ["", Validators.min(1)],//?  number; //maximum players possible
      },
        { validators: minMaxRelationValidator("playersMinimum", "playersMaximum") }
      ),

      //magazine formGroup
      magazine: this.fb.group({
        issn: ["", [Validators.minLength(8), Validators.pattern(/^\d{7}[\dxX]$/)]],//  string; //string as the last number (#8) could also be a "X"
        tableOfContentLink: ["", urlValidator()],//? string; // link to a picture of the page of content
        magazineNumber: ["", Validators.min(0)],//?  number;
        pages: ["", Validators.min(1)],//?  number;
      })
    },
      { updateOn: "blur" } // Validators errors would only be checked after user leaves field/clicks submit
    );

    // this.createForm.get("book").disable()
    // would reduce the empty fields of the forms not used, but i plan to iterate over the whole object anway to remove empty fields of the field selected, so it would be unnecessary to do here
  }

  /**
   * Call the appropriated method when the submit button was clicked and the form is valid
   */
  onSubmit(): void {
    if (!this.mediaForm.valid) {
      console.log("submit clicked, but form invalid")
      return;
    }

    if (this.isAddMode)
      this.createMedium();
    else
      this.updateMedium();
  }

  /**
   * Submit the data from the form to the backend and adjust the view accordingly
   * (The data from the form is nested, and has to be flatten first) 
   */
  createMedium() {

    // unflatten object, containing all fields that have a value
    let result = {};

    // get all filled fields from the base form
    const baseObject = this.mediaForm.value.base
    for (let prop in baseObject) {
      if (baseObject.hasOwnProperty(prop) && baseObject[prop]) {
        if (Array.isArray(baseObject[prop])) {
          if (baseObject[prop].length > 0)
            result[prop] = baseObject[prop];
        } else {
          result[prop] = baseObject[prop];
        }
      }
    }

    // determinate which sub form has to be looked at for further values
    let mediaTypeObject = {};
    switch (baseObject.mediaType) {
      case "Book": mediaTypeObject = this.mediaForm.value.book; break;
      case "CD / DVD / Blu-Ray": mediaTypeObject = this.mediaForm.value.disc; break;
      case "electronical Game": mediaTypeObject = this.mediaForm.value.digitalGame; break;
      case "Game": mediaTypeObject = this.mediaForm.value.game; break;
      case "Magazine": mediaTypeObject = this.mediaForm.value.magazine; break;
    }

    // get all the filled fields from the sub form choosen
    for (let prop in mediaTypeObject) {
      if (mediaTypeObject.hasOwnProperty(prop) && mediaTypeObject[prop]) {
        if (Array.isArray(mediaTypeObject[prop])) {
          if (mediaTypeObject[prop].length > 0)
            result[prop] = mediaTypeObject[prop];
        } else {
          result[prop] = mediaTypeObject[prop];
        }
      }
    }

    // console.log("res", result)

    this.mediaService.createMedium(result)
      .subscribe(
        {
          next: (x) => {
            console.log('Succesful created!' + JSON.stringify(x));
            this.alertService.success("Medium was successfully", { autoClose: false, keepAfterRouteChange: false });
            this.mediaForm.reset();
          },
          error: (err: Error) => {
            this.alertService.error("Error: Medium could not be created " + err, { autoClose: false, keepAfterRouteChange: false });
          },
          // complete: () => {
          // console.log('create medium observer got a complete notification');
          // },
        })
  }

  updateMedium() {

    if (!this.mediaForm.dirty) {
      console.log("submit clicked, but nothing to do. juhu")
      return;
    }

    // get dirty values from the from. (they are in a nested object)
    const dirtyValues = this.getDirtyValues(this.mediaForm)
    // console.log("dirtyValues", dirtyValues)

    let result = {};

    // unflatten object
    result = this.mediaHelper.flattenObjectLoseInformation(dirtyValues)

    // console.log("result", result)

    // call media service to sent the data to the backend
    this.mediaService.editMediumByID(this.id, result)
      .subscribe(
        {
          error: (e) => {
            this.alertService.error(`Medium was not updated. Error: ${e}`, { autoClose: false, keepAfterRouteChange: false });
            // console.log(e);
          },
          complete: () => {
            this.alertService.success(`User was successfully updated`, { autoClose: true, keepAfterRouteChange: false });
          }
        });
  }


  /**
  * Update the form data with the data receieved from back end
  * 
  * @param data received from backend
  */
  updateForm(data) {
    // console.log("#", data.title, data)

    this.mediaForm.get("base").patchValue(data)

    switch (data.mediaType) {
      case "Book": this.mediaForm.get("book").patchValue(data); break;
      case "CD / DVD / Blu-Ray": this.mediaForm.get("disc").patchValue(data); break;
      case "electronical Game": this.mediaForm.get("digitalGame").patchValue(data); break;
      case "Game": this.mediaForm.get("game").patchValue(data); break;
      case "Magazine": this.mediaForm.get("magazine").patchValue(data); break;
    }
  }

  /**
 * Return all the dirty fields from the form
 * (does not mean they contain a new value though)
 * 
 * @param form form to check for dirty values
 * @returns (nested) object
 */
  // method taken from https://stackoverflow.com/questions/53613803/angular-reactive-forms-how-to-get-just-changed-values
  getDirtyValues(form: any) {
    let dirtyValues = {};
    Object.keys(form.controls)
      .forEach(key => {
        let currentControl = form.controls[key];
        // console.log("control", currentControl.control, key)
        if (currentControl.dirty) {
          // console.log("is nested control group?", currentControl.controls, currentControl)
          if (currentControl.controls)
            dirtyValues[key] = this.getDirtyValues(currentControl);
          else
            dirtyValues[key] = currentControl.value;
        }

      });
    return dirtyValues;
  }
}
