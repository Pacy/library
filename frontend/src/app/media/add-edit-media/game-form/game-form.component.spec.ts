import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormBuilder, FormControlDirective, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';

import { GameFormComponent } from './game-form.component';

xdescribe('GameFormComponent', () => {
  let component: GameFormComponent;
  let fixture: ComponentFixture<GameFormComponent>;

  const fb = new FormBuilder()
  /**
   * https://stackoverflow.com/questions/49162404/mocking-a-parent-formgroup-via-input-in-jasmine
   *  
   * May refactor also the input, when refactoring the create/update. Not sure why I passed name instead of the form itself. Have to get more information about it first
   */
  // let formGroupDirective1: FormControlDirective;

  // const formGroupDirective = new FormGroupDirective([], []);
  // formGroupDirective.form = fb.group({
  //   test: fb.control(null)
  // });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameFormComponent ],
      imports: [MatFormFieldModule, ReactiveFormsModule, FormsModule],
      providers: [
        //
      // FormGroupDirective,
        // FormBuilder,
        // {provide: FormGroupDirective, useValue: formGroupDirective},
        // { provide: ControlContainer, useValue: formGroupDirective1 }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameFormComponent);
    component = fixture.componentInstance;

    //mock parent formGroup
    // const mockFormGroup: FormGroup = new FormGroup({
    // });

     //dummy formgroupDirective to avoid undefined addControl function
    //  const formGroupDirective1: FormGroupDirective = new FormGroupDirective([], []);
    //  component.formGroupName = "game";
   //  component.rootFromGroup.form = mockFormGroup;
    // component.ngOnInit();
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
