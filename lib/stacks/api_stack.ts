
import * as cdk from '@aws-cdk/core';
import * as ApiGateway from "@aws-cdk/aws-apigatewayv2";

import {LambdaProxyIntegration} from '@aws-cdk/aws-apigatewayv2-integrations';

import { checkServerIdentity } from "tls";
import { LambdaFunction } from '@aws-cdk/aws-events-targets';
import { LambdaInsightsVersion } from '@aws-cdk/aws-lambda';
import * as lambda from "@aws-cdk/aws-lambda";

export class ApiStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, fns: lambda.Function, props?: cdk.StackProps) {
        super(scope, id, props);
        const gateway = new ApiGateway.HttpApi(this, 'GlobalGateway', {
            description: "Global HTTP API",
            corsPreflight: {
                allowHeaders: [
                    "Content-Type",
                ],
                allowMethods: [
                    ApiGateway.CorsHttpMethod.POST,
                    ApiGateway.CorsHttpMethod.GET
                ],
            },
        });


        // create a route for each lambda
        for (let fn in fns) {
            gateway.addRoutes({
                path: "/notifications",
                methods: [ApiGateway.HttpMethod.GET],
                integration: new LambdaProxyIntegration({
                    handler: lambda
                }),
            });
        }
        

    };
};