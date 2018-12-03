import { Quote } from '../models/quote';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { QuoteJson } from '../models/quote.json';
import { QuoteJsonConverter } from './quotejsonconverter.service';
import { URLFactory } from './url.factory';

@Injectable()
export class QuotesService {

    constructor(
        private _http: HttpClient,
        private _quoteJsonConverter: QuoteJsonConverter,
        private _urlFactory: URLFactory
    ) { }

    getAll(): Observable<Quote[]> {
        return this._http.get<Quote[]>(this._urlFactory.createUrl('/api/quotes/getAll'));
    }

    getRandom(): Observable<Quote> {
        return this._http.get<QuoteJson>(this._urlFactory.createUrl('/api/quotes/getRandom'))
                .map(randQuote => this._quoteJsonConverter.convertFromJson(randQuote)).map(randQuote => {
                    if (randQuote.quote.includes('"')) {
                        randQuote.quote = randQuote.quote.split('"')[1];
                    }

                    return randQuote;
                });
    }
}
