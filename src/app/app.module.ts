import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FiltersComponent } from './filters/filters.component';
import { CountriesComponent } from './countries/countries.component';
import { LoaderComponent } from './loader/loader.component';
import { LoaderInterceptorService } from './services/loader.interceptor'

@NgModule({
  declarations: [
    AppComponent,
    FiltersComponent,
    CountriesComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
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
