import { Component, OnInit } from '@angular/core';
import { MediaService } from '../services/media/media.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { mediaSearchOptions } from '../models/meadia-search-options';
import { ActivatedRoute } from '@angular/router';
import { germanAgeRatingValidator } from './../add-media/customFormValidator'


@Component({
  selector: 'app-update-media',
  templateUrl: './update-media.component.html',
  styleUrls: ['./update-media.component.css']
})
export class UpdateMediaComponent implements OnInit {
  editForm!: FormGroup;

  getMediumSubscription: Subscription;
  medium // data of the medium request from the backend

  submitedChanges: boolean = false;
  submitSuccesful: boolean = false;
  submitRespondMessage: string = "";

  // private mediaType: string[];
  id: any;


  constructor(
    private route: ActivatedRoute,

    private mediaService: MediaService,
    // private searchOption: mediaSearchOptions,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();

    // this.mediaType = this.searchOption.getMediaTypes();

    this.route.params.subscribe(params => {
      this.id = params['id']; // get value from url
      this.getMediumSubscription = this.mediaService.getMediumByID(this.id)
        .subscribe((data) => {
          console.log(data, "Data")
          this.medium = data;
          this.updateForm(data);
        })
    })
  }

  ngOnDestroy() {
    this.getMediumSubscription.unsubscribe();
  }



  createForm() {
    this.editForm = this.fb.group({
      // common base for all mediatypes
      base: this.fb.group({
        ean: ["", Validators.minLength(13)], //?number; {value: '', disabled: true}
        title: ["", Validators.required],// string;
        releaseYear: ["", Validators.max(2300)],//? number;
        publisher: [""],//? string[]; //TODO changed to test
        description: [],//? string;
        genre: [],//? string;
        mediaType: [],//? string,
        language: [],//? string;
        // currently obsolete tags: [],//? string[];
        previewImageLink: [],//? string;
        externalProductLink: [],//? string;
      }),
      //book formGroup
      book: this.fb.group({
        // isbn: [],// number; same as ean 
        //  fruitInput: [null],
        authors: [[]],//?  string[];
        pages: ["", [Validators.min(1), Validators.max(23000)]],//? number;
        tableOfContentLink: [],//? string; //link to a picture of the page of content
      }),

      //Cd, dvd formGroup
      disc: this.fb.group({
        fsk: ['', germanAgeRatingValidator()],//? number;
        tableOfContentLink: [],//? string; //link to a picture of the page of content
        duration: ["", Validators.min(0)],//?  number; //in minutes
        involvedPerson: [[]],//? string[]; // singers, actors,...    
      }),

      //digital Game formGroup
      digitalGame: this.fb.group({
        developers: [[]],//  string[]; // in case multiple developers 
        usk: ['', germanAgeRatingValidator()],// number;
        // tableOfContentLink:[],//? not really matching for digital games
        platforms: [],// string;
      }),

      //physical games formGroup
      game: this.fb.group({
        minAge: ["", Validators.min(0)],//?  number; //minimum advised age
        playTime: ["", Validators.min(0)],//?  number; //either in minutes or a string to handle later
        playersMinimum: ["", Validators.min(1)],//? number; //minimum players needed
        playersMaximum: [],//?  number; //maximum players possible
      }),

      //magazine formGroup
      magazine: this.fb.group({
        issn: ["", [Validators.minLength(8), Validators.pattern(/^\d{7}[\dxX]$/)]],//  string; //string as the last number (#8) could also be a "X"
        tableOfContentLink: [],//? string; // link to a picture of the page of content
        magazineNumber: ["", Validators.min(0)],//?  number;
        pages: ["", Validators.min(1)],//?  number;
      })
    });

  }

  /**
   * Update the form data with the data receieved from back end
   * 
   * @param data received from backend
   */
  updateForm(data) {
    // console.log("#", data.title, data)

    this.editForm.get("base").patchValue(data)

    switch (data.mediaType) {
      case "Book": this.editForm.get("book").patchValue(data); break;
      case "CD / DVD / Blu-Ray": this.editForm.get("disc").patchValue(data); break;
      case "electronical Game": this.editForm.get("digitalGame").patchValue(data); break;
      case "Game": this.editForm.get("game").patchValue(data); break;
      case "Magazine": this.editForm.get("magazine").patchValue(data); break;
    }
  }

  onSubmit() {

    if (!this.editForm.valid || !this.editForm.dirty) {
      console.log("submit clicked, but nothing to do. wuhu")
      return;
    }

    // get dirty values from the from. (they are in a nested object)
    const dirtyValues = this.getDirtyValues(this.editForm)
    // console.log("dirtyValues", dirtyValues)

    let result = {};

    // unflatten object
    result = this.flattenObject(dirtyValues)

    // console.log("result", result)

    // call media service to sent the data to the backend
    this.mediaService.editMediumByID(this.id, result)
      .subscribe(
        {
          complete: () => {
            this.submitedChanges = true;
            this.submitSuccesful = true;
            this.submitRespondMessage = "Medium updated successfully"
            console.log('Content updated successfully!');
            //optional remove the message after a few seconds or reroute
          },
          error: (e) => {
            this.submitedChanges = true;
            this.submitSuccesful = false;
            this.submitRespondMessage = `Medium was not updated. Error: ${e}`
            console.log(e);
          },
        });
  }


  /**
    * Flatten a given (nested) object to an unflatten object. The new object contains no information about previous nested representation.
    * (i.e key2: value ; no information about a potential key1 containing key2)
    * 
    * @param object nested object to be flatten
    * @param res 
    * @returns flatten object
    */
  flattenObject(object, res = {}) {
    Object.entries(object).reduce((r, [key, val]) => {
      // const k = `${prefix}${key}`
      if (typeof val === "object") {
        if (Array.isArray(val)) {
          res[key] = val;
        }
        else
          this.flattenObject(val, r)
      } else {
        res[key] = val
      }
      return r
    }, res)
    return res;
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