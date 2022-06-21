import { TestBed } from '@angular/core/testing';

// Http testing module and mocking controller
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// Other imports
import { Media } from 'src/app/models/media';
import { MediaService as MediaService } from './media.service';

import { throwError } from 'rxjs';
import { HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';


describe('MediaSearchService', () => {
  let service: MediaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MediaService]
    });

    service = TestBed.inject(MediaService);
    httpMock = TestBed.inject(HttpTestingController);
  });


  afterEach(() => {
    // assert that there are no more pending requests.
    httpMock.verify();
  });



  /**
   * 
  * MEDIUM HTTP METHODS
  *  
  */


  it('getMediumByID should make a GET HTTP request with id at the end of the url', () => {
    const testData: Media = {
      title: 'Harry',
      _id: 1,
      mediaTyp: 'Fantasy'
    };

    // Make an HTTP GET request
    const id = 1;

    service.getMediumByID(id).subscribe(data => {
      expect(data).toEqual(testData);
      expect(data._id).toBe(id);
    })

    // The following `expectOne()` will match the request's URL.
    // If no requests or multiple requests matched that URL
    // `expectOne()` would throw.
    const req = httpMock.expectOne(`${service.getEndpointURL()}/${id}`);

    // Assert that the request is a GET.
    expect(req.request.method).toEqual('GET');

    // Respond with mock data, causing Observable to resolve.
    // Subscribe callback asserts that correct data was returned.
    req.flush(testData);
  });


  it('getMediumByIDshould should call the handleError message on an error', () => {
    const emsg = 'deliberate 404 error';
    let mockCall = spyOn(service, "handleError").and.returnValue(throwError(() => new Error("test")));

    service.getMediumByID(1).subscribe({
      next: () => fail('should have failed with 404 error'),
      error: (error: HttpErrorResponse) => {
        // console.log("Desired error occured /getMediumByID")
      }
    });

    const req = httpMock.expectOne(`${service.getEndpointURL()}/1`);
    const mockErrorResponse = { status: 404, statusText: 'Not found' };
    req.flush(emsg, mockErrorResponse);

    expect(mockCall).toHaveBeenCalled();
  });


  it(("createMedium should make a POST HTTP request with the resource as body"), () => {
    const data: Media = {
      title: "Peter Pan",
      _id: 0,
      mediaTyp: 'Book'
    };

    service.createMedium(data).subscribe((res) => {
      expect(res).toBeDefined();
      expect(res.title).toEqual(data["title"]);
    });

    const req = httpMock.expectOne(`${service.getEndpointURL()}`);

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toBe(data);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.responseType).toEqual('json');

    req.flush(data);
  });

  it('createMedium should call the handleError message on an error', () => {
    const emsg = 'deliberate 403 error';
    const mockErrorResponse = { status: 403, statusText: 'Forbidden acces' };
    let mockCall = spyOn(service, "handleError").and.returnValue(throwError(() => mockErrorResponse));

    service.createMedium({}).subscribe({
      next: () => fail('should have failed with 403 error'),
      error: (error: HttpErrorResponse) => { }
    });

    const req = httpMock.expectOne(`${service.getEndpointURL()}`);
    req.flush(emsg, mockErrorResponse);

    expect(mockCall).toHaveBeenCalled();
  });


  it(("quickSearch should make a GET HTTP request, include the searchterms in the url and return data"), () => {
    const data: Media[] = [
      {
        title: "Peter Pan",
        _id: 0,
        mediaTyp: 'Book'
      },
      {
        title: "Snow White",
        _id: 1,
        mediaTyp: 'Movie'
      }
    ];
    const searchString: Object = { searchTerm0: "Disney" };

    service.quickSearch(searchString).subscribe(res => {
      expect(res).toEqual(data);
      expect(res.length).toBe(2);
    })

    const req = httpMock.expectOne(`${service.getEndpointURL()}/quickSearch?${Object.keys(searchString)[0]}=${Object.values(searchString)[0]}`);

    expect(req.request.method).toEqual('GET');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.responseType).toEqual('json');

    req.flush(data);
  })

  it('quickSearch should call the handleError message on an error', () => {
    const emsg = 'deliberate 404 error';
    const mockErrorResponse = { status: 404, statusText: 'Not found' };
    let mockCall = spyOn(service, "handleError").and.returnValue(throwError(() => mockErrorResponse));

    service.quickSearch({ searchTerm0: "abc" }).subscribe({
      next: () => fail('should have failed with 404 error'),
      error: (error: HttpErrorResponse) => { }
    });

    const req = httpMock.expectOne(`${service.getEndpointURL()}/quickSearch?searchTerm0=abc`);
    req.flush(emsg, mockErrorResponse);

    expect(mockCall).toHaveBeenCalled();
  });


  it(("getSearchResultFromServer should make a GET HTTP request, include parameter in url and return data"), () => {
    const data: Media[] = [
      {
        title: "Peter Pan",
        _id: 0,
        mediaTyp: 'Book'
      },
      {
        title: "Snow White",
        _id: 1,
        mediaTyp: 'Book'
      }
    ];
    const searchString: Object = {
      searchField0: "No restriction",
      searchTerm0: "Disney",
      searchField1: "Title",
      searchOperator1: "or",
      searchTerm1: "Peter",
      mediaType: "Book"
    };

    service.getSearchResultFromServer(searchString).subscribe(res => {
      expect(res).toEqual(data);
      expect(res.length).toBe(2);
    })

    // hard coded current look. Could also use the tested method from the other service
    const expectedUrl = `${service.getEndpointURL()}?`
      + `searchTerm0.field=none&`
      + `searchTerm0.value=${searchString["searchTerm0"]}&`
      + `searchTerm1.field=title&`
      + `searchTerm1.operator=${searchString["searchOperator1"]}&`
      + `searchTerm1.value=${searchString["searchTerm1"]}&`
      + `mediaType=${searchString["mediaType"]}`;

    const req = httpMock.expectOne(expectedUrl);

    expect(req.request.method).toEqual('GET');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.responseType).toEqual('json');

    req.flush(data);
  })

  it('getSearchResultFromServer should call the handleError message on an error', () => {
    const emsg = 'deliberate 404 error';
    const mockErrorResponse = { status: 404, statusText: 'Not found' };
    let mockCall = spyOn(service, "handleError").and.returnValue(throwError(() => mockErrorResponse));

    service.getSearchResultFromServer({ searchTerm0: "Peter" }).subscribe({
      next: () => fail('should have failed with 404 error'),
      error: (error: HttpErrorResponse) => { }
    });

    const req = httpMock.expectOne(`${service.getEndpointURL()}?searchTerm0.field=none&searchTerm0.value=Peter`);
    req.flush(emsg, mockErrorResponse);

    expect(mockCall).toHaveBeenCalled();
  });

  it(("editMediumByID should make a PUT HTTP request, with id at the end of the url, and a resource body"), () => {
    const updateObj = {
      title: "Peter Pox"
    }
    const dataID = 1;

    service.editMediumByID(dataID, updateObj).subscribe((res) => {
      expect(res.title).toEqual(updateObj["title"]);
    })

    const req = httpMock.expectOne(`${service.getEndpointURL()}/${dataID}`);

    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toBe(updateObj);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.responseType).toEqual('json');


    req.flush(updateObj);
  })
  it('editMediumByID should call the handleError message on an error', () => {
    const emsg = 'deliberate 403 error';
    const mockErrorResponse = { status: 403, statusText: 'Forbidden' };
    let mockCall = spyOn(service, "handleError").and.returnValue(throwError(() => mockErrorResponse));

    service.editMediumByID(3, { title: "Snow white" }).subscribe({
      next: () => fail('should have failed with 403 error'),
      error: (error: HttpErrorResponse) => { }
    });

    const req = httpMock.expectOne(`${service.getEndpointURL()}/3`);
    req.flush(emsg, mockErrorResponse);

    expect(mockCall).toHaveBeenCalled();
  });

  it(("delete should make a DELETE HTTP reuqest with the id at the ne dof the url"), () => {
    const deletObjID = 3;

    service.deleteMediumByID(deletObjID).subscribe((res) => {
      expect(res).toBe(1);
    })

    const req = httpMock.expectOne(`${service.getEndpointURL()}/${deletObjID}`);

    expect(req.request.method).toEqual('DELETE');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.responseType).toEqual('json');

    req.flush(1);
  })

  it('deleteMediumByID should call the handleError message on an error', () => {
    const emsg = 'deliberate 403 error';
    const mockErrorResponse = { status: 403, statusText: 'Forbidden' };
    let mockCall = spyOn(service, "handleError").and.returnValue(throwError(() => mockErrorResponse));

    service.deleteMediumByID(3).subscribe({
      next: () => fail('should have failed with 403 error'),
      error: (error: HttpErrorResponse) => { }
    });

    const req = httpMock.expectOne(`${service.getEndpointURL()}/3`);
    req.flush(emsg, mockErrorResponse);

    expect(mockCall).toHaveBeenCalled();
  });


  /**
   * 
   * other non HTTP methods
   * 
   */

  //searchFor branch checks with error return
  it(("searchFor should call the quickSearch function"), () => {
    const mockCall = spyOn(service, "quickSearch").and.returnValue(throwError(() => new Error("Skip proper observable return")));

    service.searchFor({ searchTerm: "hello" }, true);

    expect(mockCall).toHaveBeenCalled();
  })


  it(("searchFor should call the getSearchResultFromServer function"), () => {
    const mockCall = spyOn(service, "getSearchResultFromServer").and.returnValue(throwError(() => new Error("Skip proper observable return")));

    service.searchFor({ searchTerm: "hello" }, false);

    expect(mockCall).toHaveBeenCalled();
  })

  // handle Error method 
  xit('handleError should throwError', () => {
    // const mockError: HttpErrorResponse ={
    //   name: 'HttpErrorResponse',
    //   message: 'test error',
    //   error: 404,
    //   ok: false,
    //   headers: new HttpHeaders,
    //   status: 404,
    //   statusText: 'Not found',
    //   url: service.getEndpointURL(),
    //   type: HttpEventType.ResponseHeader
    // };

    // // spyOn(service, 'handleError').and.callThrough();
    // const result = service.handleError(mockError);
    // console.log(result)
  })
});