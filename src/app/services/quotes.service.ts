import { Quote } from '../models/quote';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { QuoteJson } from '../models/quote.json';
import { QuoteJsonConverter } from './quotejsonconverter.service';

@Injectable()
export class QuotesService {

    constructor(private _http: HttpClient, private _quoteJsonConverter: QuoteJsonConverter) { }

    getAll(): Observable<Quote[]> {
        return this._http.get<Quote[]>('/api/quotes/getAll');
    }

    getRandom(): Observable<Quote> {
        return this._http.get<QuoteJson>('/api/quotes/getRandom')
                .map(randQuote => this._quoteJsonConverter.convertFromJson(randQuote)).map(randQuote => {
                    if (randQuote.quote.includes('"')) {
                        randQuote.quote = randQuote.quote.split('"')[1];
                    }

                    return randQuote;
                });
    }
}
