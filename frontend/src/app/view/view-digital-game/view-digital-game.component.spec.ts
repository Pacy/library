import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDigitalGameComponent } from './view-digital-game.component';

describe('ViewDigitalGameComponent', () => {
  let component: ViewDigitalGameComponent;
  let fixture: ComponentFixture<ViewDigitalGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDigitalGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDigitalGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
