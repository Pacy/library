import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaSearchSimpleComponent } from './media-search-simple.component';

describe('MediaSearchSimpleComponent', () => {
  let component: MediaSearchSimpleComponent;
  let fixture: ComponentFixture<MediaSearchSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaSearchSimpleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaSearchSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
