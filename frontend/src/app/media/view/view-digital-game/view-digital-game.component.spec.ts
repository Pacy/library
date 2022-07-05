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
    component.data = {
      // example: anno 1404
      developers: ["Blue Byte", "Related Designs"],
      platform: "PC",
      // playTime: ,
      usk: 6
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should contain the input data in the dom", () => {
    const compiled = fixture.nativeElement;
    // could also get more specific with quering for "td" elements
    expect(compiled.innerHTML).toContain(component.data.developers);
    expect(compiled.innerHTML).toContain(component.data.platform);
    expect(compiled.innerHTML).toContain(component.data.usk);
  })
});