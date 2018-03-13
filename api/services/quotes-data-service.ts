import * as AWS from 'aws-sdk';
import * as DOC from 'dynamodb-doc';
import * as rn from 'random-number';

AWS.config.update({
    accessKeyId: process.env.DYNAMODB_ACCESS_KEY,
    secretAccessKey: process.env.DYNAMODB_SECRET,
    region: process.env.DYNAMODB_REGION
});

const awsDynamoClient = new AWS.DynamoDB();
const docClient = new DOC.DynamoDB(awsDynamoClient);

export class QuotesDataService {
    getRandomQuote() {
        return awsDynamoClient.scan({
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
}
