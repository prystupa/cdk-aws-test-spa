import * as cdk from '@aws-cdk/core';
import * as apigateway from '@aws-cdk/aws-apigateway';
import {MockIntegration, PassthroughBehavior} from "@aws-cdk/aws-apigateway";

export class ApiGatewayStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const api = new apigateway.RestApi(this, 'cdk-test-spa-api');

        const deals = api.root.addResource('deals');
        deals.addMethod('GET', new MockIntegration({
            integrationResponses: [{
                statusCode: '200',
                responseTemplates: {
                    'application/json': JSON.stringify([])
                }
            }],
            passthroughBehavior: PassthroughBehavior.NEVER,
            requestTemplates: {
                'application/json': '{ "statusCode": 200 }',
            }
        }), {
            methodResponses: [{statusCode: '200'}],
        });
    }
}
