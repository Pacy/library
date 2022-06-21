import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGameComponent } from './view-game.component';

describe('ViewGameComponent', () => {
  let component: ViewGameComponent;
  let fixture: ComponentFixture<ViewGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGameComponent);
    component = fixture.componentInstance;
    component.data = {
      // uno example
      playersMinimum: 2,
      playersMaximum: 10,
      // playTime: ,
      age: 7
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should contain the input data in the dom", () => {
    const compiled = fixture.nativeElement;
    // could also get more specific with quering for "td" elements
    expect(compiled.innerHTML).toContain(component.data.age);
    expect(compiled.innerHTML).toContain(component.data.playersMaximum);
    expect(compiled.innerHTML).toContain(component.data.playersMaximum);
  })
});
