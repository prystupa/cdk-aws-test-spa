import * as cdk from "@aws-cdk/core";
import * as wafv2 from '@aws-cdk/aws-wafv2';
import * as apigateway from "@aws-cdk/aws-apigateway";

interface Props extends cdk.StackProps {
    api: apigateway.RestApi
}

function getResourceARNForEndpoint(region: string, restApiId: string, stageName: string): string {
    return cdk.Fn.join("",
        [
            "arn:aws:apigateway:",
            region,
            "::/restapis/",
            restApiId,
            "/stages/",
            stageName
        ]
    );
}

export class WafStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: Props) {
        super(scope, id, props);

        const whitelist = new wafv2.CfnIPSet(this, 'api-whitelist-ip-set', {
            name: 'spa-test-api-whitelist',
            description: 'Whitelist of IPs to access API for test SPA',
            addresses: [],
            ipAddressVersion: 'IPV4',
            scope: 'REGIONAL'
        });

        const whitelistRule: wafv2.CfnWebACL.RuleProperty = {
            name: "whitelist-by-ip",
            priority: 0,
            action: {
                allow: {allow: true}
            },
            statement: {
                ipSetReferenceStatement: {arn: whitelist.attrArn}
            },
            visibilityConfig: {
                sampledRequestsEnabled: true,
                cloudWatchMetricsEnabled: true,
                metricName: 'whitelist-by-ip-allow'
            }
        };

        const webAcl = new wafv2.CfnWebACL(this, 'api-web-acl', {
            name: 'spa-test-api-web-acl',
            defaultAction: {
                block: {block: true}
            },
            scope: 'REGIONAL',
            visibilityConfig: {
                cloudWatchMetricsEnabled: false,
                sampledRequestsEnabled: true,
                metricName: 'waf'
            },
            rules: [whitelistRule]
        });

        const {deploymentStage: {stageName}, restApiId} = props.api;
        new wafv2.CfnWebACLAssociation(this, 'api-web-cal-association', {
            webAclArn: webAcl.attrArn,
            resourceArn: getResourceARNForEndpoint('us-east-1', restApiId, stageName)
        });
    }
}
