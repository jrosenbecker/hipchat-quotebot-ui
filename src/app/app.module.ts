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
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TokenComponent } from './token/token.component';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/authguard.service';
import { TokenInterceptor } from './interceptors/token-interceptor.service';
import { RefreshTokenInterceptor } from './interceptors/refresh-token-interceptor.service';
import { AddQuoteModalComponent } from './home/add-quote-modal/add-quote-modal';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    TokenComponent,
    AddQuoteModalComponent
  ],
  imports: [
    BrowserModule,
    MaterializeModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    QuotesService,
    QuoteJsonConverter,
    PhotoService,
    URLFactory,
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
