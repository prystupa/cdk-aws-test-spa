import * as cdk from '@aws-cdk/core';
import * as apigateway from '@aws-cdk/aws-apigateway';
import {MockIntegration, PassthroughBehavior} from "@aws-cdk/aws-apigateway";

export class ApiGatewayStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const api = new apigateway.RestApi(this, 'cdk-test-spa-api');

        const deals = api.root.addResource('deals', {
            defaultCorsPreflightOptions: {
                allowOrigins: apigateway.Cors.ALL_ORIGINS,
                allowMethods: apigateway.Cors.ALL_METHODS
            }
        });
        deals.addMethod('GET', new MockIntegration({
            integrationResponses: [{
                statusCode: '200',
                responseTemplates: {
                    'application/json': JSON.stringify([])
                },
                responseParameters: {
                    'method.response.header.Access-Control-Allow-Origin': '\'*\''
                }
            }],
            passthroughBehavior: PassthroughBehavior.NEVER,
            requestTemplates: {
                'application/json': '{ "statusCode": 200 }',
            }
        }), {
            methodResponses: [{
                statusCode: '200',
                responseParameters: {
                    'method.response.header.Access-Control-Allow-Origin': true
                }
            }],
        });
    }
}
