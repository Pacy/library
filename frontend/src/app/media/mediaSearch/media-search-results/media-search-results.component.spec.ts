import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaSearchResultsComponent } from './media-search-results.component';

xdescribe('MediaSearchResultsComponent', () => {
  let component: MediaSearchResultsComponent;
  let fixture: ComponentFixture<MediaSearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaSearchResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
