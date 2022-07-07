import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';

import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, delay, shareReplay, catchError } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { AppSettings } from 'src/appSetting';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  /**
   * authentification service creation was guided by https://blog.angular-university.io/angular-jwt-authentication/ (and other sources. But most affected by the mentioned one)
   * 
   * 
   */
  private isUserLoggedIn = new BehaviorSubject<boolean>(false);
  private userAcessLevel = new BehaviorSubject<number>(1);

  private endpoint = AppSettings.api + "/user";


  constructor(
    private http: HttpClient
  ) {
    this.isUserLoggedIn.next(this.isLoggedIn());


    if (this.isUserLoggedIn.value) // if a userIsLoggedIn, there should also be a token in localstorage
      this.userAcessLevel.next(this.getAccessLevelFromToken()); // items in localStorage are string therefore parse it into a number
  }

  get isLoggedInObservable() {
    return this.isUserLoggedIn.asObservable();
  }
  get userAccessLevelObseravable() {
    return this.userAcessLevel.asObservable();
  }

  getAccessLevelFromToken() {
    let token = localStorage.getItem('id_token');
    let decodedToken;
    if (token) {
      decodedToken = jwt_decode(token);
      return decodedToken.accessLevel;
    }
  }


  login(email: string, password: string) {
    let apiUrl = `${this.endpoint}/login`;

    return this.http.post<User>(apiUrl, { email, password }).pipe(
      tap(res => this.setSession(res)),
      shareReplay(), // to prevent the receiver of this Observable from accidently triggering multiple POST request due to multiple subscriptions
      catchError(this.handleError)
    )
  }

  private setSession(authResult) {
    const pattern = /([a-zA-Z]+)/;
    const expiresIn = authResult.expiresIn.split(pattern); //split expireIn time into the number and the time unit values

    const expiresAt = moment().add(expiresIn[0], expiresIn[1]); //[0] is the number value, [1] contains the time unit

    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));

    this.isUserLoggedIn.next(this.isLoggedIn());
    this.userAcessLevel.next(authResult.accessLevel);
  }

  isLoggedIn() {
    if (moment().isBefore(this.getExpiration())) {
      return true;
    } else {
      return false;
    }
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  logout(): void {
    this.isUserLoggedIn.next(false);
    this.userAcessLevel.next(1); // 1 is a standard user
    localStorage.removeItem('expires_at');
    localStorage.removeItem('id_token');
    // ideally inform user about logout too, but that is more important with a refresh token around and when the request is sent to the server
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
      errorMessage = `Error Code: ${error.status} \nError: ${error.error} `;
      // window.alert(errorMessage);
      console.log(errorMessage + `\nMessage: ${error.message}`);
    }
    // console.log(errorMessage);
    return throwError(() => errorMessage);
  }
}
