import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import * as awsServerlessExpress from 'aws-serverless-express';
import appServer from './server';

const server = awsServerlessExpress.createServer(appServer);

export const handler: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  
  awsServerlessExpress.proxy(server, event, context);
}