import * as cdk from "@aws-cdk/core";
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as s3 from '@aws-cdk/aws-s3';

export class CloudFrontStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const siteBucket = new s3.Bucket(this, 'cdk-test-site-bucket');
        new cloudfront.Distribution(this, 'cdk-test-distribution', {
            defaultBehavior: {origin: new origins.S3Origin(siteBucket)},
            defaultRootObject: 'index.html'
        });
    }
}
