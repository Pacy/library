import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginComponent } from './login.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, RouterTestingModule, HttpClientTestingModule, MatCardModule, MatFormFieldModule,
         MatInputModule, BrowserAnimationsModule], 
      declarations: [ LoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("form invalid when empty", () =>{
    expect(component.loginForm.valid).toBeFalsy();
  })

  it("email field validity", () =>{
    let email = component.loginForm.controls["email"];
    expect(email.valid).toBeFalsy();

    let errors={};
    errors = email.errors;
    expect(errors["required"]).toBeTruthy();

    email.setValue("test");
    errors = email.errors;
    expect(email.valid).toBeTruthy();

    
    // check if form is still invalid
    expect(component.loginForm.valid).toBeFalsy();
  });

  it("password field validity", () =>{
    let password = component.loginForm.controls["password"];
    expect(password.valid).toBeFalsy();

    let errors={};
    errors = password.errors;
    expect(errors["required"]).toBeTruthy();

    password.setValue("test");
    errors = password.errors;
    expect(password.valid).toBeTruthy();

    
    // check if form is still invalid
    expect(component.loginForm.valid).toBeFalsy();
  });

  it("form submit", () =>{
    expect(component.loginForm.valid).toBeFalsy();
    component.loginForm.controls["email"].setValue("test");
    component.loginForm.controls["password"].setValue("test");
    expect(component.loginForm.valid).toBeTruthy();

    let mockcall = spyOn(component, "login").and.callThrough();
    const form = fixture.debugElement.query(By.css("form"))
    form.triggerEventHandler("submit",{});
    expect(mockcall).toHaveBeenCalledOnceWith({email: 'test', password: 'test'});
  });

  xit("form submit sets alert", () =>{
    /**
     * Have to check for success, and error respond from service and see if alert is set appropriately 
     */
  });

});