import { Injectable } from '@angular/core';
import { QuoteJson } from '../models/quote.json';
import { Quote } from '../models/quote';
import * as moment from 'moment';

@Injectable()
export class QuoteJsonConverter {
    convertFromJson(json: QuoteJson): Quote {
        const quote: Quote = {
            addedOn: moment().millisecond(json.AddedOn),
            addedBy: json.AddedBy,
            quote: json.Quote,
            quotee: json.Quotee
        };

        return quote;
    }
}
