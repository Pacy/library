import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  styleUrls: ['.././add-media.component.css','./game-form.component.css']
})
export class GameFormComponent implements OnInit {
  @Input() formGroupName!: string;
  form!: FormGroup
  
  constructor(private rootFromGroup: FormGroupDirective) { }

  ngOnInit(): void {
    this.form = this.rootFromGroup.control.get(this.formGroupName) as FormGroup;
  }

}