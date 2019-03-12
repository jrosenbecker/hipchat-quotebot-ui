import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { URLFactory } from './url.factory';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
    constructor(
        private _cookieService: CookieService,
        private _router: Router,
        private _http: HttpClient,
        private _urlFactory: URLFactory
    ) { }

    setCredentials(credentials: {
        accessToken: string,
        idToken: string,
        expiryDate: string,
        refreshToken?: string
    }): void {
        this._cookieService.set('access_token', credentials.accessToken);
        this._cookieService.set('id_token', credentials.idToken);
        this._cookieService.set('expiry_date', credentials.expiryDate);

        if (credentials.refreshToken) {
            this._cookieService.set('refresh_token', credentials.refreshToken);
        }
    }

    isAuthenticated(): boolean {
        return this._cookieService.get('access_token') != null && !this.isTokenExpired();
    }

    isTokenExpired(): boolean {
        const expires: number = +this._cookieService.get('expiry_date');
        return moment() > moment.unix(expires);
    }

    getToken(): string {
        return this._cookieService.get('access_token');
    }

    refreshAccessToken(): Observable<string> {
        return this._http.post<any>(this._urlFactory.createUrl('/login/refresh'), {
            refresh_token: this._cookieService.get('refresh_token')
        }).pipe(map((accessTokenResponse) => {
            this._cookieService.set('access_token', accessTokenResponse.access_token);
            return accessTokenResponse.access_token;
        }));
    }

    logout(): void {
        this._cookieService.deleteAll();
        window.location.href = environment.homeUrl;
    }
}
