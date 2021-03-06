import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { MediaService } from '../../services/media/media.service';

import { AddMediaComponent } from './add-edit-media.component';

xdescribe('AddMediaComponent', () => {
  let component: AddMediaComponent;
  let fixture: ComponentFixture<AddMediaComponent>;

  let mediaServiceStub = {
    // getMediumByID: (id) => { return {subscribe: () => {:id: id,"title": "Harry"} } }, 
  //  getMediumByID: (id) => {return {_id: 1, "title": "Harry" }}, 

  };
  // let mediaServiceStub = jasmine.createSpyObj('MediaService', ['getMediumByID']);


  /**
   *
   * Added the starting point from the update-media.spec.ts into this.
   * 
   * 
   */
 
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddMediaComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: 1, }), },
        },
        { provide: MediaService, useValue: mediaServiceStub },

      ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatCardModule
      ],

    })
      .compileComponents();
  });

  beforeEach(() => {
    // mediaServiceStub.getMediumByID.and.returnValue( of({a:1}) )
    fixture = TestBed.createComponent(AddMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

// vvvvvvvv
//refactoring update/create component to be less overlap. skipping these tests for that reason
// ^^^^
  it("should call the getMediumByID method with the proper id value", () =>{
    // let mockCall = spyOn(mediaServiceStub, "getMediumByID")//.and.returnValue(throwError(() => new Error("test")));
    // component.ngOnInit();
    // expect(mockCall).toHaveBeenCalledOnceWith(1);

  })
  // that it calls update method  //and update forms
  // form testing
  // submit ngif#s are set correctly
  // test dirty vales function
});
