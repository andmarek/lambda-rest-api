import events = require('@aws-cdk/aws-events');
import targets = require('@aws-cdk/aws-events-targets');

import { ApiStack } from 'stacks/api_stack';

import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';

import fs = require('fs');

export class RemindMeStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    let responseLambdas: lambda.Function[] = []
    let handlerPaths: string[] = ["../src/reminder"];

    // Create a lambda for each of the paths
    for (let handlerPath in handlerPaths) {
      const lambdaFn = this.createApiLambda(handlerPath);
      responseLambdas.concat(lambdaFn)
    }
    const apiStack = new ApiStack(
      this, 'ApiStack', {
        fns: responseLambdas
      }
    )
  }

  createApiLambda = (handler_path: string): lambda.Function => {
    const lambdaFn = new lambda.Function(this, 'Singleton', {
        code: new lambda.InlineCode(fs.readFileSync('src/reminder.py', { encoding: 'utf-8' })),
        handler: handler_path,
        runtime: lambda.Runtime.PYTHON_3_6,
      });

      const rule = new events.Rule(this, 'Rule', {
        schedule: events.Schedule.expression('cron(0 18 ? * MON-FRI *)')
      });

      rule.addTarget(new targets.LambdaFunction(lambdaFn))
      return lambdaFn
  };
}



const app = new cdk.App();
new RemindMeStack(app, 'RemindMeStack');
app.synth();