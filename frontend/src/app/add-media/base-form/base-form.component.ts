import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { mediaSearchOptions } from '../../models/meadia-search-options'
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { chipListAdd, chipListRemove } from '../chipListHelper'

@Component({
  selector: 'app-base-form',
  templateUrl: './base-form.component.html',
  styleUrls: ['.././add-media.component.css', './base-form.component.css']
})
export class BaseFormComponent implements OnInit {
  @Input() formGroupName!: string;
  form!: FormGroup;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  publisher;

  genreList: string[];
  constructor(
    private rootFromGroup: FormGroupDirective,
    private mediaSearch: mediaSearchOptions
  ) { }

  ngOnInit(): void {
    this.form = this.rootFromGroup.control.get(this.formGroupName) as FormGroup
    this.genreList = this.mediaSearch.getGenres();
    this.publisher = this.form.get('publisher');
  }


  addPublisher(event: MatChipInputEvent): void {
    chipListAdd(event, this.publisher)
  }

  removePublisher(publisher: string): void {
    chipListRemove(publisher, this.publisher)
  }

}