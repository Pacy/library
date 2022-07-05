import { ComponentFixture, TestBed } from '@angular/core/testing';
import { mixinErrorState } from '@angular/material/core';
import { By } from '@angular/platform-browser';

import { ViewMagazineComponent } from './view-magazine.component';

describe('ViewMagazineComponent', () => {
  let component: ViewMagazineComponent;
  let fixture: ComponentFixture<ViewMagazineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMagazineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMagazineComponent);
    component = fixture.componentInstance;
    component.data = {
      issn: 12312312,
      magazineNumber: 1,
      pages: 12
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should contain the input data in the dom", () => {
    const compiled = fixture.nativeElement;
    // could also get more specific with quering for "td" elements
    expect(compiled.innerHTML).toContain(component.data.issn);
    expect(compiled.innerHTML).toContain(component.data.pages);
    expect(compiled.innerHTML).toContain(component.data.magazineNumber);
  })

});
