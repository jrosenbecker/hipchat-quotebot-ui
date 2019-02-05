import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import moment = require('moment');

@Injectable()
export class AuthService {
    constructor(private _cookieService: CookieService, private _router: Router) { }

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

    logout(): void {
        this._cookieService.deleteAll();
        this._router.navigate(['/']);
    }
}
