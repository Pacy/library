import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../services/user/authentification.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;

  constructor(public authService : AuthentificationService, private router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedInObservable; // store reference to the observable
  }


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
