#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkApiStack } from '../lib/cdk-api-stack';

const app = new cdk.App();
new CdkApiStack(app, 'CdkApiStack');
