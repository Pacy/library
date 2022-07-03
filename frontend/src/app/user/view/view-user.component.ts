import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-view',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
  ) { }

   user: User;
   users: User[];

  ngOnInit(): void {
    // this.getUser();
    this.getUsers();
  }

  /**
   * get the user information from the user specified via url value(id)
   */
  getUser() {
    // no need to unsubscribe from ActivatedRoute observable
    this.route.params.subscribe(params => {
      let id = params['id']; // get value from url
      // this.subscription = 
      this.userService.getUserByID(id)
        .subscribe({
          next: (data) => {
            this.user = data;
          },
          error: (e) => {

          },
          complete: () => console.log("getUser Observable completed")
        })
    })
  }

  getUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (e) => {
        console.log("getUsers error: ", e)
      },
      complete: () => console.log("getUsers Observable completed")
    })
  }
}
