import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsComponent } from './news.component';

import { MatGridListModule } from '@angular/material/grid-list';
import { By } from '@angular/platform-browser';


describe('NewsComponent', () => {
  let component: NewsComponent;
  let fixture: ComponentFixture<NewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewsComponent],
      imports: [MatGridListModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("expect the main tile to be the first tile of the tile list at the start", () => {
    const main = fixture.debugElement.nativeElement.querySelector(".main-tile");
    const tileList = fixture.debugElement.queryAll(By.css('.tile-container'));

    expect(main.querySelector(".main-tile-header").innerText).toBe(tileList[0].nativeElement.querySelector(".tile-header").innerText);
    expect(main.querySelector("p").innerHTML).toBe(tileList[0].nativeElement.querySelector("p").innerHTML);
  })

  it("should change the main tile to the one clicked", () => {
    // compares only the <p> tag. Assuming that no tile-content is similiar to 100% in them
    const main = fixture.debugElement.nativeElement.querySelector(".main-tile");
    const tileList = fixture.debugElement.queryAll(By.css('.tile-container'));

    expect(main.querySelector("p").innerHTML).toBe(tileList[0].nativeElement.querySelector("p").innerHTML);

    tileList[1].nativeElement.click();
    fixture.detectChanges();

    expect(main.querySelector("p").innerHTML).toBe(tileList[1].nativeElement.querySelector("p").innerHTML);
  })

  // 1 st tile == main tile on start
  // highlighted tile == main tile
  it("expect only the main tile to be highlighted", () => {
    const tileList = fixture.debugElement.queryAll(By.css('mat-grid-tile'));

    // [0] is the main tile  == [1] selected tile at the start
    expect(tileList[1].nativeElement.classList).toContain("active-tile")

    // click next tile
    tileList[2].nativeElement.click();
    fixture.detectChanges();

    expect(tileList[1].nativeElement.classList).not.toContain("active-tile");
    expect(tileList[2].nativeElement.classList).toContain("active-tile");
  })
});
