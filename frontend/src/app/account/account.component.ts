import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/user/authentification.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(private authService : AuthentificationService, private router: Router) { }

  ngOnInit(): void {
    this.isUserLoggedIn();
  }

  isUserLoggedIn(){
    if(!this.authService.isLoggedIn()){
      this.router.navigate(["/login"])
    }
  }
  
}
