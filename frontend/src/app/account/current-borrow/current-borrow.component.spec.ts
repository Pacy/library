import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentBorrowComponent } from './current-borrow.component';

describe('CurrentBorrowComponent', () => {
  let component: CurrentBorrowComponent;
  let fixture: ComponentFixture<CurrentBorrowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentBorrowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentBorrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
