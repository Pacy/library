import { Injectable } from '@angular/core';
import { Media } from 'src/app/models/media';

import { Observable, Subject, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { AppSettings } from 'src/appSetting';
import { catchError, map, share } from 'rxjs/operators';
import { MediaHelper } from './media-helper';


@Injectable({
  providedIn: 'root'
})
export class MediaService {

  private endpoint = AppSettings.api + "/media";
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  // const headers = new HttpHeaders().append('header', 'value');

  constructor(
    // private searchOption: mediaSearchOptions,
    private http: HttpClient,
    private mediaHelper: MediaHelper
  ) { }

  //determine if user already used the search
  private searched = false;

  //used searchQuerry; probally not gonna use this (ToDO check if keep or delete)
  private searchedForString: string;

  searchResult = new Array<Media>();

  // viewMedia methods subscribe to this subject to received update
  subject$ = new Subject();

  getEndpointURL() {
    return this.endpoint;
  }

  // return the search results in an array
  getSearchResult() {
    // console.log("getSearchResult", this.searchResult)
    return this.searchResult;
  }

  /**
   * 
   * @param id object id of the medium that wants to be retrieved from server
   * @returns object that was tried to retrieve
   */
  getMediumByID(id): Observable<any> {
    let apiUrl = `${this.endpoint}/${id}`;
    return this.http.get(apiUrl, { headers: this.headers })
      .pipe(
        share(), //todo check if still needed actually
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.handleError)
      )
  }


  getMediumExemplarByID(id) { }

  editMediumByID(id, data): Observable<any> {
    const apiUrl = `${this.endpoint}/${id}`;
    return this.http.put(apiUrl, data, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  editMediumExemplarByID(i) { }

  deleteMediumByID(id): Observable<any> {
    const apiUrl = `${this.endpoint}/${id}`;
    return this.http.delete(apiUrl)
      .pipe(catchError(this.handleError))
  }


  deleteMediumExemplarByID(i) { }

  /**
   * Sent a create request to the backend with the given data object
   * @param data 
   */
  createMedium(data: object): Observable<any> {
    const apiUrl = `${this.endpoint}`;

    return this.http.post(apiUrl, data)
      .pipe
      (catchError(this.handleError))
  }

  createMediumExemplar() { }

  setSearched(b: boolean) {
    this.searched = b;
  }
  getSearched() {
    return this.searched;
  }
  /**
   * 
   * @param obj object received from the search fields
   * @param quickSearchUsed method was called via simple search if true (else extended search)
   */
  searchFor(obj, quickSearchUsed: boolean) {
    //toDO check user input (security wise, not syntactic)
    this.setSearched(true);
    if (!quickSearchUsed) {
      this.getSearchResultFromServer(obj)
        .subscribe({
          next: (result: Media[]) => {
            this.searchResult = result;
            this.subject$.next(this.searchResult)
          },
          error: (e) => console.log("Error while trying to get server search results: " +e),
          complete: () => console.log("searchFor completed")
        }
        )
    } else {
      this.quickSearch(obj)
        .subscribe({
          next: (result: Media[]) => {
            this.searchResult = result;
            this.subject$.next(this.searchResult)
          },
          error: (e) => console.log("Error with quickSearch execution: " +e),
          complete: () => console.log("searchFor/quickSearch completed")
        })
    }
    this.searchedForString = this.mediaHelper.getSearchedForString(obj);
  }


  getData(): Observable<any> {
    return this.subject$.asObservable();
  }

  /**
   * 
   * @param searchObject Object that contains one search string for the backend
   * @returns server respond for the given search
   */
  quickSearch(searchObject): Observable<Media[]> {
    let queryParameter = this.mediaHelper.flattenObjectKeepInformation(searchObject)
    queryParameter = new URLSearchParams(queryParameter).toString();

    let apiUrl = `${this.endpoint}/quickSearch?${queryParameter}`;

    return this.http.get<Media[]>(apiUrl)//, {headers: this.headers,  params: paramss})
      .pipe(
        catchError(this.handleError)
      )
  }

  /**
   * 
   * @param searchObject Object that contains all search criteria from the user
   * @returns the server respond to the given searchObject
   */
  getSearchResultFromServer(searchObject): Observable<Media[]> {

    let simplifiedData = this.mediaHelper.simplifySearchObject(searchObject);
    let queryParameter = this.mediaHelper.flattenObjectKeepInformation(simplifiedData)
    queryParameter = new URLSearchParams(queryParameter).toString();

    let apiUrl = `${this.endpoint}?${queryParameter}`;

    return this.http.get<Media[]>(apiUrl)//, {headers: this.headers,  params: paramss})
      .pipe(
        catchError(this.handleError)
      )
  }

  /**
   * 
   * @returns string that was used for the search if defined
   */
  getSearchedForString() {
    if (typeof this.searchedForString === 'undefined') {
      return "error: search string is undefined";
    } else if (this.searchedForString.length == 0) {
      return "the search string is empty";
    } else {
      return this.searchedForString;
    }
  }

  // Error handling 
  handleError(error: HttpErrorResponse) {
    console.log("handle error")
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status} \nError: ${error.error} \nMessage: ${error.message}`;
      // window.alert(errorMessage);
      console.log(errorMessage)
    }
    // console.log(errorMessage);
    return throwError(() => { new Error(errorMessage) });
  }
}