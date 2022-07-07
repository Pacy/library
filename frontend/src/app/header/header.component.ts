import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../services/user/authentification.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertService } from '../alert';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;
  accessLevel//: Observable<number>;
  subscription;

  constructor(
    public authService: AuthentificationService,
    private router: Router,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedInObservable; // store reference to isLoggedIn BehaviorSubject
    this.subscription = this.authService.userAccessLevelObseravable.subscribe(val => this.accessLevel = val); // subscribe to value changes of accessLevel of the user
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  logout(): void {
    this.authService.logout();
    this.alertService.success("Logout successful", { autoClose: true, keepAfterRouteChange: true });
    this.router.navigate(['/']);
  }
}
