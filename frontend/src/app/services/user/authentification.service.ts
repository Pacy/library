import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';

import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, delay, shareReplay, catchError } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { AppSettings } from 'src/appSetting';


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
  private endpoint = AppSettings.api + "/user";


  constructor(
    private http: HttpClient
  ) {
    this.isUserLoggedIn.next(this.isLoggedIn());
  }

  get isLoggedInObservable() {
    return this.isUserLoggedIn.asObservable(); // {2}
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

    const expiresAt = moment().add(expiresIn[0], expiresIn[1]);

    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));

    this.isUserLoggedIn.next(this.isLoggedIn());
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
    localStorage.removeItem('expires_at');
    localStorage.removeItem('id_token');
    // ideally inform user about logout too, but that is more important with a refresh token around
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
