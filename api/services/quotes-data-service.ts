import * as AWS from 'aws-sdk';
import * as DOC from 'dynamodb-doc';
import * as rn from 'random-number';
import { Quote } from '../models/quote';
import { QuoteValidatorService } from './quote-validator-service';


export class QuotesDataService {
    private _quoteValidator: QuoteValidatorService;

    constructor() {
        this._quoteValidator = new QuoteValidatorService();
    }

    getRandomQuote() {
        AWS.config.update({
            accessKeyId: process.env.DYNAMODB_ACCESS_KEY,
            secretAccessKey: process.env.DYNAMODB_SECRET,
            region: process.env.DYNAMODB_REGION
        });
        const awsDynamoClient = new AWS.DynamoDB();
        const docClient = new DOC.DynamoDB(awsDynamoClient);

        return docClient.scan({
            TableName: 'Quotes'
        }).promise().then((data) => {
            const items = data.Items;
            const max =  items.length;
            const index = rn({
                min: 0,
                max: max - 1,
                integer: true
            });
            return items[index];
        }).catch(err => {
            console.error(err);
            throw err;
        });
    }

    saveQuote(quote: Quote): Promise<any> {
        if (!this._quoteValidator.isQuoteValid(quote)) {
            return Promise.reject('Quote was not valid');
        }

        AWS.config.update({
            accessKeyId: process.env.DYNAMODB_ACCESS_KEY,
            secretAccessKey: process.env.DYNAMODB_SECRET,
            region: process.env.DYNAMODB_REGION
        });

        const awsDynamoClient = new AWS.DynamoDB();
        const docClient = new DOC.DynamoDB(awsDynamoClient);

        return docClient.putItem({
            TableName: 'Quotes',
            Item: quote,
        }).promise();
    }
}
