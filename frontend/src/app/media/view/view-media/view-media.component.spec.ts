import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Media } from 'src/app/models/media';

import { ViewMediaComponent } from './view-media.component';

xdescribe('ViewMediaComponent', () => {
  let component: ViewMediaComponent;
  let fixture: ComponentFixture<ViewMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMediaComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should create the correct subViewComponent"), () =>{
    const data: Media = {
      _id: 1,
      title: "Hello World",
      mediaTyp: "Book"
    }

    const result = component.loadSubCategoryView(data);
    
  }


  /**
 * template
 * 
 */
});
