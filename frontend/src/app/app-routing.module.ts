import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddMediaComponent } from './add-media/add-media.component';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account.component';



const routes: Routes = [
  { path: 'addMedia', component: AddMediaComponent},
  { path: 'account', component: AccountComponent},
  { path: 'home', component: HomeComponent},
  { path: '', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
