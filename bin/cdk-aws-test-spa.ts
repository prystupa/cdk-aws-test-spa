#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';

import { ApiGatewayStack } from '../lib/api-gateway-stack';
import {CloudFrontStack} from "../lib/cloud-front-stack";

const app = new cdk.App();
new ApiGatewayStack(app, 'cdk-test-api-gateway-stack');
new CloudFrontStack(app, 'cdk-test-cloud-front-stack');
