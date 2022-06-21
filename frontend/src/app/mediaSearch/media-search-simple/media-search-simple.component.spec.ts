import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MediaService } from 'src/app/services/media/media.service';

import { MediaSearchSimpleComponent } from './media-search-simple.component';

describe('MediaSearchSimpleComponent', () => {
  let component: MediaSearchSimpleComponent;
  let fixture: ComponentFixture<MediaSearchSimpleComponent>;
  let mediaService: MediaService;
  let mediaServiceStub = {
    searchFor: (obj, boolean) => { return 0 }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MediaSearchSimpleComponent],
      providers: [
        { provide: MediaService, useValue: mediaServiceStub },
      ],
      imports: [
        FormsModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule // not exactly sure why this is needed!
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaSearchSimpleComponent);
    component = fixture.componentInstance;

    mediaService = TestBed.inject(MediaService)
    fixture.detectChanges();

  });

  beforeEach(waitForAsync(() => {
    /** taken from: https://stackoverflow.com/questions/39582707/updating-input-html-field-from-within-an-angular-2-test
     * Without this the data submitted in the submit function is empty
     *
     * "The magic sauce!!
     * Because this is in an async wrapper
     * it will automatically wait for the call to whenStable() to complete"
     */
    fixture.detectChanges();
    fixture.whenStable();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should contain a mat-icon button, that submits the entered values to the search service", fakeAsync(() => {
    const button = fixture.debugElement.nativeElement.querySelector("button");
    expect(button).toBeTruthy();
    const mock = spyOn(mediaService, "searchFor")//.and.callThrough();

    expect(mock).not.toHaveBeenCalled();

    let inputValue: HTMLInputElement = fixture.debugElement.nativeElement.querySelector("input");
    const dummyInput = "test"
    inputValue.value = dummyInput;
    inputValue.dispatchEvent(new Event('input'));

    button.click();
    tick();
    fixture.detectChanges();

    expect(mock).toHaveBeenCalledWith({ searchTerm0: dummyInput }, true);
  }));

});
