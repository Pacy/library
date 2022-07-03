import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthentificationService } from '../../services/user/authentification.service';
import { Router } from '@angular/router';

@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

   loginForm: FormGroup;

   constructor(
      private authService: AuthentificationService,
      private router: Router,
      private fb: FormBuilder
   ) { }

   ngOnInit() {
      this.loginForm = this.fb.group({
         email: ["", Validators.required],
         password: ["", Validators.required]
      });
   }

   login(data: any) {
      const email = data.email;
      const password = data.password;

      this.authService.login(email, password)
         .subscribe({
            next: (data) => {
               if (data)
                  this.router.navigate(['/account']);
            },
            error: (err) => {
               console.log("login error: " + err);
            },
            // complete: () => {
            //    console.log('login observer got a complete notification');
            // }
         })
   }
}
