import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDiscComponent } from './view-disc.component';

describe('ViewDiscComponent', () => {
  let component: ViewDiscComponent;
  let fixture: ComponentFixture<ViewDiscComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDiscComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDiscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
