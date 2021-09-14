import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as RemindMe from '../lib/remind_me-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new RemindMe.RemindMeStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
