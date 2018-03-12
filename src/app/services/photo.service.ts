import { Quote } from '../models/quote';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Photo } from '../models/photo';

@Injectable()
export class PhotoService {

    constructor(private _http: HttpClient) { }


    getRandom(): Observable<Photo> {
        return this._http.get<Photo>('/api/photos/getRandom');
    }
}
