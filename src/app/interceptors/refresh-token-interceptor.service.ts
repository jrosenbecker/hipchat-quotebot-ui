import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { filter, switchMap, take, catchError } from 'rxjs/operators';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
    private refreshTokenInProgress = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private _authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(error => {
            // Don't want to refresh on login or on a refresh token request
            if (request.url.includes('refresh') || request.url.includes('login')) {

                // If the refresh token request failed, logout
                if (request.url.includes('refresh')) {
                    this._authService.logout();
                }
                return Observable.throw(error);
            }

            // Only try to refresh if a 401 response was received
            if (error.status !== 401) {
                return Observable.throw(error);
            }

            if (this.refreshTokenInProgress) {
                return this.refreshTokenSubject
                    .pipe(
                        filter(result => result !== null),
                        take(1),
                        switchMap(() => next.handle(this.addAuthenticationToken(request)))
                    );
            } else {
                this.refreshTokenInProgress = true;
                this.refreshTokenSubject.next(null);

                return this._authService.refreshAccessToken()
                    .pipe(
                        switchMap((token: any) => {
                            this.refreshTokenInProgress = false;
                            this.refreshTokenSubject.next(token);
                            return next.handle(this.addAuthenticationToken(request));
                        }),
                        catchError((err: any) => {
                            this.refreshTokenInProgress = false;
                            return Observable.throw(err);
                        })
                    );
            }
        }));
    }

    addAuthenticationToken(request) {
        // Get access token from Local Storage
        const accessToken = this._authService.getToken();

        // If access token is null this means that user is not logged in
        // And we return the original request
        if (!accessToken) {
            return request;
        }

        // We clone the request, because the original request is immutable
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${this._authService.getToken()}`
            }
        });
    }
}
