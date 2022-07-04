import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
// media components
import { AddMediaComponent } from './add-media/add-media.component';
import { MediaSearchComponent } from './mediaSearch/media-search/media-search.component';
import { ViewMediaComponent } from './view/view-media/view-media.component';
import { UpdateMediaComponent } from './update-media/update-media.component';
// user components
import { CreateUserComponent } from './user/add-edit/add-edit-user.component';
import { ViewUserComponent } from './user/view/view-user.component';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from './user/login/login.component';
// guards
import { AuthGuardService } from './services/guard/auth-guard.service';
import { RoleGuardService } from './services/guard/role-guard.service';

// AuthGuard currently not necessary as it appears every time RoleGuard appears. If RoleGuard is true, AuthGuard should be true too

const routes: Routes = [
  { path: 'home', component: HomeComponent },

  // media related
  { path: 'addMedia', component: AddMediaComponent, canActivate: [AuthGuardService, RoleGuardService], data: {accessLevel: 2} },
  { path: 'mediaSearch', component: MediaSearchComponent, canActivate: [AuthGuardService, RoleGuardService], data: {accessLevel: 2} },
  { path: 'viewMedia/:id', component: ViewMediaComponent, canActivate: [AuthGuardService, RoleGuardService], data: {accessLevel: 2} },
  { path: 'editMedia/:id', component: UpdateMediaComponent, canActivate: [AuthGuardService, RoleGuardService], data: {accessLevel: 2}},

  // user related
  { path: 'account', component: AccountComponent},
  { path: 'login', component: LoginComponent },
  { path: 'createUser', component: CreateUserComponent, canActivate: [AuthGuardService, RoleGuardService], data: {accessLevel: 2} },
  { path: 'viewUser/:id', component: ViewUserComponent, canActivate: [AuthGuardService, RoleGuardService], data: {accessLevel: 2} },
  { path: 'editUser/:id', component: CreateUserComponent, canActivate: [AuthGuardService, RoleGuardService], data: {accessLevel: 2} },

  // default
  //optional create PageNotFound instead
  { path: '', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
