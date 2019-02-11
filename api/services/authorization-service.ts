import * as AWS from 'aws-sdk';
import { oAuthService } from './google-oauth-service';
import * as jwt_decode from 'jwt-decode';
import { IDToken } from '../models/id-token';
import * as moment from 'moment';

const AUTHORIZATION_TABLE_NAME  = process.env.AUTHORIZATION_TABLE_NAME;
const AUTHORIZATION_TABLE_CONFIG = {
    accessKeyId: process.env.DYNAMODB_AUTHORIZATION_ACCESS_KEY,
    secretAccessKey: process.env.DYNAMODB_AUTHORIZATION_SECRET,
    region: process.env.DYNAMODB_AUTHORIZATION_REGION
};

export class AuthorizationService {
    isAuthorized(accessToken: string): Promise<boolean> {
        AWS.config.update(AUTHORIZATION_TABLE_CONFIG);
        const awsDynamoClient = new AWS.DynamoDB();

        if (accessToken.includes('Bearer ')) {
            accessToken = accessToken.replace('Bearer ', '');
        }

        return awsDynamoClient.scan({
            TableName: AUTHORIZATION_TABLE_NAME,
            ExpressionAttributeValues: {
                ':at': { S: accessToken }
            },
            FilterExpression: 'accessToken = :at'
        }).promise().then((data) => {
            if (data.Count === 1) {
                const userToken = data.Items[0];
                if (this.isExpired(+userToken['expires'].N)) {
                    return false;
                }
                return true;
            }

            return false;
        });
    }

    isExpired(expiration: number): boolean {
        return expiration && moment() > moment.unix(expiration);
    }

    saveSession(email: string, accessToken: string, idToken: string): Promise<any> {
        AWS.config.update(AUTHORIZATION_TABLE_CONFIG);
        const awsDynamoClient = new AWS.DynamoDB();

        const decodedID: IDToken = jwt_decode(idToken);
        const expires = decodedID.exp;

        return awsDynamoClient.updateItem({
            ExpressionAttributeNames: {
                '#AT': 'accessToken',
                '#EXP': 'expires'
            },
            ExpressionAttributeValues: {
                ':at': {
                    S: accessToken
                },
                ':exp': {
                    N: expires.toString()
                }
            },
            UpdateExpression: 'SET #AT = :at, #EXP = :exp',
            TableName: AUTHORIZATION_TABLE_NAME,
            Key: {
                email: {
                    S: email
                }
            }
        }).promise().then((data) => {
            return data;
        }).catch((error) => {
            console.error(error);
            throw error;
        });
    }

    isEmailWhitelisted(email: string): Promise<boolean> {
        AWS.config.update(AUTHORIZATION_TABLE_CONFIG);
        const awsDynamoClient = new AWS.DynamoDB();

        return awsDynamoClient.query({
            TableName: AUTHORIZATION_TABLE_NAME,
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
