import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { take } from 'rxjs/operators';

@Component({
    templateUrl: './token.component.html'
})
export class TokenComponent implements OnInit {
    access_token: string;
    id_token: string;
    refresh_token: string;
    expiry_date: string;
    token_type: string;

    constructor(private _route: ActivatedRoute, private _authService: AuthService, private _router: Router) {}

    ngOnInit(): void {
        const accessToken = this._route.snapshot.queryParamMap.get('access_token');
        const idToken = this._route.snapshot.queryParamMap.get('id_token');
        const refreshToken = this._route.snapshot.queryParamMap.get('refresh_token');
        const expiryDate = this._route.snapshot.queryParamMap.get('expiry_date');

        this.expiry_date = expiryDate;
        this._authService.setCredentials({
            accessToken,
            idToken,
            expiryDate,
            refreshToken
        });


        this._router.navigate(['/']);
    }


}
