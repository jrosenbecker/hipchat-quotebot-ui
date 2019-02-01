import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './token.component.html'
})
export class TokenComponent implements OnInit {
    access_token: string;
    id_token: string;
    refresh_token: string;
    expiry_date: string;
    token_type: string;

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.access_token = this.route.snapshot.queryParamMap.get('access_token');
        this.id_token = this.route.snapshot.queryParamMap.get('id_token');
        this.refresh_token =  this.route.snapshot.queryParamMap.get('refresh_token');
        this.expiry_date =  this.route.snapshot.queryParamMap.get('expiry_date');
        this.token_type = this.route.snapshot.queryParamMap.get('token_type');
    }

}
