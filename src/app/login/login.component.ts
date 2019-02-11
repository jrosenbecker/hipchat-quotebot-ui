import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['login.component.css']
})
export class LoginComponent {
    constructor(private _router: Router) { }

    login() {
        window.location.href = `${environment.apiUrl}/login`;
    }
}
