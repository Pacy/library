import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AppSettings } from 'src/appSetting';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private endpoint = AppSettings.api + "/user";
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  // const headers = new HttpHeaders().append('header', 'value');

  constructor(
    private http: HttpClient
  ) { }

  // Sent a get request to retrieve users
  getUsers(): Observable<any> {
    let apiUrl = `${this.endpoint}/`;
    return this.http.get(apiUrl, { headers: this.headers })
      .pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.handleError)
      )
  }

  // Sent a get request to the backend for the user with the specified ID
  getUserByID(id): Observable<any> {
    let apiUrl = `${this.endpoint}/${id}`;
    return this.http.get(apiUrl, { headers: this.headers })
      .pipe(
        map((res: Response) => {
          return res || {}
        }),
        catchError(this.handleError)
      )
  }

  // Sent a put request to the backend for the user with the specified ID, and a the data to be changed
  editUserByID(id, data): Observable<any> {
    const apiUrl = `${this.endpoint}/${id}`;
    return this.http.put(apiUrl, data, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }


  // Sent a delete request to the backend for the user with the specified ID
  deleteUserByID(id): Observable<any> {
    const apiUrl = `${this.endpoint}/${id}`;
    return this.http.delete(apiUrl)
      .pipe(catchError(this.handleError))
  }

  /**
* Sent a create request to the backend with the given data object
* @param data 
*/
  createUser(data: object): Observable<any> {
    const apiUrl = `${this.endpoint}`;
    console.log("create", data)
    
    return this.http.post(apiUrl, data)
      .pipe
      (catchError(this.handleError))
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

