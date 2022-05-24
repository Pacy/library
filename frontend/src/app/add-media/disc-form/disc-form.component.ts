import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { chipListAdd, chipListRemove } from '../chipListHelper'

@Component({
  selector: 'app-disc-form',
  templateUrl: './disc-form.component.html',
  styleUrls: ['.././add-media.component.css', './disc-form.component.css']
})
export class DiscFormComponent implements OnInit {
  @Input() formGroupName!: string;
  form!: FormGroup;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  involvedPerson;

  constructor(private rootFromGroup: FormGroupDirective) { }

  ngOnInit(): void {
    this.form = this.rootFromGroup.control.get(this.formGroupName) as FormGroup;
    this.involvedPerson = this.form.get('involvedPerson');
  }

  addPerson(event: MatChipInputEvent): void {
    chipListAdd(event, this.involvedPerson)
  }

  removePerson(person: string): void {
    chipListRemove(person, this.involvedPerson)
  }
}