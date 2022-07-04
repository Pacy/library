import { Injectable } from '@angular/core';
import { CanActivate} from '@angular/router';
import { take } from 'rxjs';
import { AuthentificationService } from '../user/authentification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private auth: AuthentificationService) { }

  // check if user is logged in
  canActivate(): boolean {
    let loggedIn;
    this.auth.isLoggedInObservable
      .pipe(take(1))
      .subscribe(val => loggedIn = val);

      return loggedIn;
  }
}
