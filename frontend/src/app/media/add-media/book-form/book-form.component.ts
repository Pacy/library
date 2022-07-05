import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { chipListAdd, chipListRemove } from '../chipListHelper'


@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['.././add-media.component.css', './book-form.component.css']
})
export class BookFormComponent implements OnInit {
  @Input() formGroupName!: string;
  form!: FormGroup;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  authors;

  constructor(private rootFromGroup: FormGroupDirective) { }

  ngOnInit(): void {
    this.form = this.rootFromGroup.control.get(this.formGroupName) as FormGroup
    this.authors = this.form.get('authors');
  }


  addAuthor(event: MatChipInputEvent): void {
    chipListAdd(event, this.authors)
  }

  removeAuthor(author: string): void {
    chipListRemove(author, this.authors)
  }
}