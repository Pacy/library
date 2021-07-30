import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddMediaComponent } from './add-media/add-media.component';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account.component';
import { MediaSearchComponent } from './mediaSearch/media-search/media-search.component';
import { MediaSearchResultsComponent } from './mediaSearch/media-search-results/media-search-results.component';
import { ViewMediaComponent } from './view/view-media/view-media.component';



const routes: Routes = [
  { path: 'addMedia', component: AddMediaComponent},
  { path: 'account', component: AccountComponent},
  { path: 'home', component: HomeComponent},
  { path: 'mediaSearch', component: MediaSearchComponent},
  { path: 'viewMedia/:id', component: ViewMediaComponent},
  { path: '', component: HomeComponent} //optional create PageNotFound instead
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
