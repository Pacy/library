import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-magazine-form',
  templateUrl: './magazine-form.component.html',
  styleUrls: ['.././add-edit-media.component.css','./magazine-form.component.css']
})
export class MagazineFormComponent implements OnInit {
  @Input() formGroupName!: string;
  form!: FormGroup;

  constructor(private rootFromGroup: FormGroupDirective) { }

  ngOnInit(): void {
    this.form = this.rootFromGroup.control.get(this.formGroupName) as FormGroup
  }

}