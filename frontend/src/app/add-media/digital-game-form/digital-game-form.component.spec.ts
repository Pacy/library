import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalGameFormComponent } from './digital-game-form.component';

describe('DigitalGameFormComponent', () => {
  let component: DigitalGameFormComponent;
  let fixture: ComponentFixture<DigitalGameFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DigitalGameFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalGameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
