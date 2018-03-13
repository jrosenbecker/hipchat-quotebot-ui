# Hipchat Quotebot UI

This repository is for the site which cycles through Madison office quotes and overlays them with pictures. The site is set up using AWS Lambda + API Gateway as a backend and S3 to host an Angular application, both behind AWS CloudFront to serve on the same domain (https://d37vxlk909894z.cloudfront.net/).

## Setup
1. Clone the repository
2. Run `npm install` (which may take a while)
3. Tell Ogden to give you credentials to read the DynamoDB "Quotes" table. Since he is hosting the DynamoDB on his AWS instance you will need seperate AWS credentials to access this (configured later on).
4. Get API credentials from Flickr to setup a photo album to use as a source of images. https://www.flickr.com/services/api/misc.api_keys.html
5. Upload images to an album on Flickr and then grab the ID of both the album and your user.
6. Create a file called `serverless.variables.yml` in the root of the project which will hold the credentials you were given.
```
DYNAMODB_ACCESS_KEY: '{YOUR_ACCESS_KEY_FROM_OGDEN}'
DYNAMODB_SECRET: '{YOUR_SECRET_FROM_OGDEN}'
DYNAMODB_REGION: 'us-east-1'

FLICKR_KEY: '{YOUR_FLICKR_API_KEY}'
FLICKR_USER_ID: '{YOUR_FLICKR_USER_ID}'
FLICKR_PHOTOSET_ID: '{YOUR_FLICKR_ALBUM_ID'
```
7. Run `npm start` to start the project locally. This will then be hosted at http://localhost:3000

## Deployment
If you want to deploy your own version, first set up AWS credentials to your own AWS instance: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html

Once this is done you should be able to run `npm run deploy` which will let CloudFormation handle all of the heavy lifting of setting up the different AWS resources. The first deployment will take a long time since CloudFront needs to be set up and propogate, though deployments after that will take less time if there are no changes to CloudFront. Once done, you should be able to access your version of the site at the domain CloudFront created.