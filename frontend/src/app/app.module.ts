import { BrowserModule } from '@angular/platform-browser';
import {
  NgModule,
  LOCALE_ID // used for datepicker local format
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// angular material related
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';


// Services
import { MediaService } from './services/media/media.service';
import { UserService } from './services/user/user.service';

// interceptor
import { AuthInterceptor } from './http-interceptors/auth-interceptor'

// media realted
import { AddMediaComponent } from './add-media/add-media.component';
import { ViewMediaComponent } from './view/view-media/view-media.component';
import { ViewGameComponent } from './view/view-game/view-game.component';
import { ViewDiscComponent } from './view/view-disc/view-disc.component';
import { ViewDigitalGameComponent } from './view/view-digital-game/view-digital-game.component';
import { ViewMagazineComponent } from './view/view-magazine/view-magazine.component';
import { ViewBookComponent } from './view/view-book/view-book.component';
import { SubCategoryViewDirective } from './view/view-media/sub-category-view.directive';
import { BookFormComponent } from './add-media/book-form/book-form.component';
import { DiscFormComponent } from './add-media/disc-form/disc-form.component';
import { GameFormComponent } from './add-media/game-form/game-form.component';
import { DigitalGameFormComponent } from './add-media/digital-game-form/digital-game-form.component';
import { MagazineFormComponent } from './add-media/magazine-form/magazine-form.component';
import { BaseFormComponent } from './add-media/base-form/base-form.component';
import { UpdateMediaComponent } from './update-media/update-media.component';
import { MediaSearchExtendedComponent } from './mediaSearch/media-search-extended/media-search-extended.component';
import { MediaSearchSimpleComponent } from './mediaSearch/media-search-simple/media-search-simple.component';
import { MediaSearchResultsComponent } from './mediaSearch/media-search-results/media-search-results.component';
import { MediaSearchComponent } from './mediaSearch/media-search/media-search.component';

import { MatNativeDateModule } from '@angular/material/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HeaderComponent } from './header/header.component';

// user related
import { CreateUserComponent } from './user/add-edit/add-edit-user.component';
import { ViewUserComponent } from './user/view/view-user.component';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from './user/login/login.component';



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
    ViewMediaComponent,
    ViewGameComponent,
    ViewDiscComponent,
    ViewDigitalGameComponent,
    ViewMagazineComponent,
    ViewBookComponent,
    SubCategoryViewDirective,
    BookFormComponent,
    DiscFormComponent,
    GameFormComponent,
    DigitalGameFormComponent,
    MagazineFormComponent,
    BaseFormComponent,
    UpdateMediaComponent,
    HeaderComponent,
    CreateUserComponent,
    ViewUserComponent,
    LoginComponent
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
    MatPaginatorModule,
    HttpClientModule,
    MatChipsModule,
    MatRadioModule,
    NgbModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    MediaService,
    UserService,
    { provide: LOCALE_ID, useValue: 'de-DE' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } //multi true; returns an array of instances. Allows multiple providers to speard across many files ..
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
