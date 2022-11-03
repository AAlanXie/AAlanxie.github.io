import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Material Modules
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormComponent } from './form/form.component';
import { BusinessComponent } from './business/business.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BusinessDetailComponent } from './business-detail/business-detail.component';
import {GoogleMapsModule} from "@angular/google-maps";
import { BookingComponent } from './booking/booking.component';
import { SearchComponent } from './search/search.component';
import { MatTabsModule } from '@angular/material/tabs';
import { DatePipe } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    BusinessComponent,
    BusinessDetailComponent,
    BookingComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    GoogleMapsModule,
    MatTabsModule
  ],
  providers: [
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
