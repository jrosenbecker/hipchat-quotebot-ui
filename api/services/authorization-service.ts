import * as AWS from 'aws-sdk';
import { oAuthService } from './google-oauth-service';

export class AuthorizationService {
    // getEmailFromAccessToken(accessToken: string): Promise<string> {

    // }

    isAuthorized(email: string): Promise<boolean> {
        AWS.config.update({
            accessKeyId: process.env.DYNAMODB_AUTHORIZATION_ACCESS_KEY,
            secretAccessKey: process.env.DYNAMODB_AUTHORIZATION_SECRET,
            region: process.env.DYNAMODB_AUTHORIZATION_REGION
        });
        const awsDynamoClient = new AWS.DynamoDB();

        return awsDynamoClient.query({
            TableName: 'QuotebotAuthorizedUsers',
            ExpressionAttributeValues: {
                ':e': { S: email }
            },
            KeyConditionExpression: 'email = :e'
        }).promise().then((data) => {
            if (data.Count > 0) {
                return true;
            }
            return false;
        }).catch((error) => {
            console.error(error);
            throw error;
        });
    }
}
