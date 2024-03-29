import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { NewsComponent} from './news/news.component'
// media components
import { AddMediaComponent } from './media/add-edit-media/add-edit-media.component';
import { MediaSearchComponent } from './media/mediaSearch/media-search/media-search.component';
import { ViewMediaComponent } from './media/view/view-media/view-media.component';
// user components
import { CreateUserComponent } from './user/add-user/add-edit-user.component';
import { ViewUserComponent } from './user/view-user/view-user.component';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from './user/login/login.component';
// guards
import { AuthGuardService } from './services/guard/auth-guard.service';
import { RoleGuardService } from './services/guard/role-guard.service';

// AuthGuard currently not necessary as it appears every time RoleGuard appears. If RoleGuard is true, AuthGuard should be true too

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'news', component: NewsComponent},

  // media related
  { path: 'addMedia', component: AddMediaComponent, canActivate: [AuthGuardService, RoleGuardService], data: { accessLevel: 2 } },
  { path: 'mediaSearch', component: MediaSearchComponent },
  { path: 'viewMedia/:id', component: ViewMediaComponent},
  { path: 'editMedia/:id', component: AddMediaComponent, canActivate: [AuthGuardService, RoleGuardService], data: { accessLevel: 2 } },

  // user related
  { path: 'account', component: AccountComponent },
  { path: 'login', component: LoginComponent },
  { path: 'createUser', component: CreateUserComponent, canActivate: [AuthGuardService, RoleGuardService], data: { accessLevel: 2 } },
  { path: 'viewUser/:id', component: ViewUserComponent, canActivate: [AuthGuardService, RoleGuardService], data: { accessLevel: 2 } },
  { path: 'editUser/:id', component: CreateUserComponent, canActivate: [AuthGuardService, RoleGuardService], data: { accessLevel: 2 } },

  // default
  //optional create PageNotFound instead
  { path: '', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
