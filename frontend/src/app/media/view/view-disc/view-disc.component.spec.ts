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
    component.data = {
      // example: Lord of the rings, the fellowship.. extended version
      duration: 218,
      involvedPerson: ["Elijah Wood","Viggo Mortensen", "Sean Astin", "Orlando Bloom", "Ian McKellen"],
      // playTime: ,
      fsk: 16
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should contain the input data in the dom", () => {
    const compiled = fixture.nativeElement;
    // could also get more specific with quering for "td" elements
    expect(compiled.innerHTML).toContain(component.data.fsk);
    expect(compiled.innerHTML).toContain(component.data.duration);
    expect(compiled.innerHTML).toContain(component.data.involvedPerson);
  })
});