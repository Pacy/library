import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscFormComponent } from './disc-form.component';

xdescribe('DiscFormComponent', () => {
  let component: DiscFormComponent;
  let fixture: ComponentFixture<DiscFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
