import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddMediaComponent } from './add-media/add-media.component';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account.component';

import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatGridListModule} from '@angular/material/grid-list';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MediaSearchComponent } from './mediaSearch/media-search/media-search.component';
import { MediaSearchResultsComponent } from './mediaSearch/media-search-results/media-search-results.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { MediaSearchExtendedComponent } from './mediaSearch/media-search-extended/media-search-extended.component';
import { MediaSearchSimpleComponent } from './mediaSearch/media-search-simple/media-search-simple.component';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';

// Services
import { MediaSearchService } from './services/search/media-search-service.service';
import { ViewMediaComponent } from './view/view-media/view-media.component';

@NgModule({
  declarations: [
    AppComponent,
    AddMediaComponent,
    HomeComponent,
    AccountComponent,
    MediaSearchComponent,
    MediaSearchResultsComponent,
    MediaSearchExtendedComponent,
    MediaSearchSimpleComponent,
    ViewMediaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    BrowserAnimationsModule,
    MatGridListModule,
    FlexLayoutModule,// still needed?
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule, 
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule
    ],
  providers: [MediaSearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
