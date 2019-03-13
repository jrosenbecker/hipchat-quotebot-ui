import { Quote } from 'api/models/quote';

export class QuoteValidatorService  {
    isQuoteValid(quote: Quote): boolean {
        if (!quote || !quote.Quote || !quote.Quotee) {
            return false;
        }
        return true;
    }
}
