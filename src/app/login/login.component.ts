import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    constructor(private _router: Router) { }

    ngOnInit() {
        window.location.href = `${environment.apiUrl}/login`;
    }
}
