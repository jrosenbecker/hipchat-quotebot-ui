import * as AWS from 'aws-sdk';
import * as DOC from 'dynamodb-doc';
AWS.config.update({
    accessKeyId: process.env.DYNAMODB_ACCESS_KEY,
    secretAccessKey: process.env.DYNAMODB_SECRET,
    region: process.env.DYNAMODB_REGION
});

const awsDynamoClient = new AWS.DynamoDB();
const docClient = new DOC.DynamoDB(awsDynamoClient);

export class QuotesDataService {
    getAllQuotes() {
        return docClient.scan({
            TableName: 'Quotes'
        }).promise().then((data) => {
            return data;
        }).catch(err => {
            console.log(err);
            throw err;
        });
    }
}
