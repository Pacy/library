import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-create',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.css'],
})
export class CreateUserComponent implements OnInit {
  createForm!: FormGroup;

  id: string;
  isAddMode: boolean;


  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private route: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.createForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      birthday: ["", Validators.required],
      email: ["", [Validators.email, Validators.required]],
      phoneNumber: [""], //Number,

      city: ["", Validators.required],
      zipCode: [],
      street: ["", Validators.required],

      libraryCardNumber: [],

      accessLevel: [1, Validators.required],  // 1 standard user, 2 library intern/helper, 3 library staff, (4 library admin)

      // attributes that should probably not be handled here
      // accountStatus: ["", Validators.required], // 0 inactive, 1 active, 2 
      // overdueMedia: Boolean, // if some medium have exceeded the return date
      // loanFee: Number,// the amount of fees to pay, (if someone forgot to )
      //valideTill: [], // account valide till; inactive accounts do not have to have a date

      // optional, a reset for password may be good if the staff should handle it. Could also be a seperate page for it, or access via viewUser/:id screen

      staffNote: [], // a little notebook about the user

    })

    if (!this.isAddMode) {
      this.userService.getUserByID(this.id).subscribe({
        next: (x) => this.createForm.patchValue(x),
        error: (err) => console.log("getting User data error: ", err),
        // complete: () => console.log("getting User by ID Observable completed")
      })

    }
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.createForm.invalid) {
      return;
    }

    if (this.isAddMode) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  createUser() {

    let result = { ...this.createForm.value };
    console.log(this.createForm.value)

    // remove empty fields
    for (let key in result) {
      if (result[key] === null || result[key] === "") {
        delete result[key];
      }
    }

    // set (default) values for required attributes of user (could actually also do this in the backend. Need to figure out which spot is the prefered one)
    result["password"] = result["birthday"].getDate().toString() + (result["birthday"].getMonth() + 1); // password = DAY + MONTH (string concatenation)
    result["overdueMedia"] = false;
    result["accountStatus"] = 1;

    this.userService.createUser(result).subscribe({
      next: (x) => {
        console.log("user added success", x);

      },
      error: (err: Error) => {
        console.log("error adding new user", err)
      },
      complete: () => {
        console.log("create user observer completed")
      }
    })
  }

  updateUser() {

    if (!this.createForm.dirty) {
      console.log("submit clicked, but nothing to do. juhu")
      return;
    }

    // get dirty values from the from. (they are in a nested object)
    const result = this.getDirtyValues(this.createForm)

    // call media service to sent the data to the backend
    this.userService.editUserByID(this.id, result)
      .subscribe(
        {
          error: (e) => {
            // this.submitedChanges = true;
            // this.submitSuccesful = false;
            // this.submitRespondMessage = `User was not updated. Error: ${e}`
            console.log(e);
          },
          complete: () => {
            // this.submitedChanges = true;
            // this.submitSuccesful = true;
            // this.submitRespondMessage = "User updated successfully";
            console.log("edit user by id was completed")
            // console.log('Content updated successfully!');
            //optional remove the message after a few seconds or reroute
          }
        });
  }

  /**
     * Return all the dirty fields from the form
     * (does not mean they contain a new value though)
     * 
     * @param form form to check for dirty values
     * @returns (nested) object
     */
  // toDO: duplicate method from media edit component. Need to encapsulate it later
  // method taken from https://stackoverflow.com/questions/53613803/angular-reactive-forms-how-to-get-just-changed-values
  getDirtyValues(form: any) {
    let dirtyValues = {};
    Object.keys(form.controls)
      .forEach(key => {
        let currentControl = form.controls[key];
        if (currentControl.dirty) {
          if (currentControl.controls)
            dirtyValues[key] = this.getDirtyValues(currentControl);
          else
            dirtyValues[key] = currentControl.value;
        }

      });
    return dirtyValues;
  }

}
