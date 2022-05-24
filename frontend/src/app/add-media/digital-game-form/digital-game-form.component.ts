import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { chipListAdd, chipListRemove } from '../chipListHelper'

@Component({
  selector: 'app-digital-game-form',
  templateUrl: './digital-game-form.component.html',
  styleUrls: ['./digital-game-form.component.css', '.././add-media.component.css']
})
export class DigitalGameFormComponent implements OnInit {
  @Input() formGroupName!: string;
  form!: FormGroup;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  developer;

  constructor(private rootFromGroup: FormGroupDirective) { }

  ngOnInit(): void {
    this.form = this.rootFromGroup.control.get(this.formGroupName) as FormGroup;
    this.developer = this.form.get('developers');
  }

  addDeveloper(event: MatChipInputEvent): void {
    chipListAdd(event, this.developer)
  }

  removeDeveloper(developer: string): void {
    chipListRemove(developer, this.developer)
  }
}