import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { take } from 'rxjs';
import { AuthentificationService } from '../user/authentification.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {

  constructor(private auth: AuthentificationService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let userAccessLevel;
    const minAccessLevel = route.data.accessLevel;

    this.auth.userAccessLevelObseravable
      .pipe(take(1))
      .subscribe(val => userAccessLevel = val);

    return userAccessLevel >= minAccessLevel;
  }
}
