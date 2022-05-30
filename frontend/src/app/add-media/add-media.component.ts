import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MediaService } from '../services/media/media.service';
import { germanAgeRatingValidator, minMaxRelationValidator, urlValidator } from './customFormValidator'


@Component({
  selector: 'app-add-media',
  templateUrl: './add-media.component.html',
  styleUrls: ['./add-media.component.css']
})
export class AddMediaComponent implements OnInit {
  createForm!: FormGroup;

  serverResponded: boolean = false;
  submitSuccesful: boolean = false;
  submitRespondMessage: string;

  constructor(
    private mediaApi: MediaService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.createForm = this.fb.group({
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
        platforms: [],// string;
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
   * Submit the data from the create form to the backend and adjust the view accordingly
   * (The data from the form is nested, and has to be flatten first) 
   * 
   */
  onSubmit(): void {
    // console.warn(this.createForm.value);
    // console.log(this.createForm.errors)

    //optional: close previous alert message

    // unflatten object, containing all fields that have a value
    let result = {};

    // get all filled fields from the base form
    const baseObject = this.createForm.value.base
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
      case "Book": mediaTypeObject = this.createForm.value.book; break;
      case "CD / DVD / Blu-Ray": mediaTypeObject = this.createForm.value.disc; break;
      case "electronical Game": mediaTypeObject = this.createForm.value.digitalGame; break;
      case "Game": mediaTypeObject = this.createForm.value.game; break;
      case "Magazine": mediaTypeObject = this.createForm.value.magazine; break;
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

    this.mediaApi.createMedium(result)
      .subscribe(
        {
          next: (x) => {
            console.log('Succesful created!' + JSON.stringify(x));
            this.serverResponded = true;
            this.submitSuccesful = true;
            this.submitRespondMessage = "Medium was created"
            this.createForm.reset();
            // todo show sucess message
          },
          error: (err: Error) => {
            console.error('create medium got an error: ' + err);
            this.serverResponded = true;
            this.submitSuccesful = false;
            this.submitRespondMessage = "Medium could not be created.\n" + err;
          },
          complete: () => {
            // console.log('create medium observer got a complete notification');
            // todo show sucess message
          },
        })
  }

  /**
   * close the alert messsage by setting the boolean variable to display it to false
   */
  closeAlert() {
    this.serverResponded = false;
  }
}
