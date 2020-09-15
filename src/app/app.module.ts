import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FiltersComponent } from './filters/filters.component';
import { CountriesComponent } from './countries/countries.component';
import { LoaderComponent } from './loader/loader.component';
import { LoaderInterceptorService } from './services/loader.interceptor';
import { CardComponent } from './card/card.component'

@NgModule({
  declarations: [
    AppComponent,
    FiltersComponent,
    CountriesComponent,
    LoaderComponent,
    CardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    GraphQLModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
