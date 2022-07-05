import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaSearchExtendedComponent } from './media-search-extended.component';

xdescribe('MediaSearchExtendedComponent', () => {
  let component: MediaSearchExtendedComponent;
  let fixture: ComponentFixture<MediaSearchExtendedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaSearchExtendedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaSearchExtendedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
