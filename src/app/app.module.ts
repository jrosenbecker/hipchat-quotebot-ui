import 'materialize-css';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterializeModule } from 'angular2-materialize';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app.routes';
import { HomeComponent } from './home/home.component';
import { IconLinkComponent } from './iconlink/iconlink.component';
import { RandomComponent } from './home/random/random.component';
import { QuotesService } from './services/quotes.service';
import { QuoteJsonConverter } from './services/quotejsonconverter.service';
import { PhotoService } from './services/photo.service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    IconLinkComponent,
    RandomComponent
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
    PhotoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
