import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBookComponent } from './view-book.component';

describe('ViewBookComponent', () => {
  let component: ViewBookComponent;
  let fixture: ComponentFixture<ViewBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBookComponent);
    component = fixture.componentInstance;
    component.data = {
      // example: Faust
      ean: "9783150000014",
      authors: ["Johann Wolfgang Goethe"],
      genre: "Drama",
      pages: 136,
      // tableOfContentLink:
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should contain the input data in the dom", () => {
    const compiled = fixture.nativeElement;
    // could also get more specific with quering for "td" elements
    expect(compiled.innerHTML).toContain(component.data.ean);
    expect(compiled.innerHTML).toContain(component.data.authors);
    expect(compiled.innerHTML).toContain(component.data.genre);
    expect(compiled.innerHTML).toContain(component.data.pages);
  })
});