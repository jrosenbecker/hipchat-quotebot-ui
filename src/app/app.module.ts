import 'materialize-css';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/forkJoin';
import { MaterializeModule } from 'angular2-materialize';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { HomeComponent } from './home/home.component';
import { QuotesService } from './services/quotes.service';
import { QuoteJsonConverter } from './services/quotejsonconverter.service';
import { PhotoService } from './services/photo.service';
import { URLFactory } from './services/url.factory';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    MaterializeModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    QuotesService,
    QuoteJsonConverter,
    PhotoService,
    URLFactory
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
