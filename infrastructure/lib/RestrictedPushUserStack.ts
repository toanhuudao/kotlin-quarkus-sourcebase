import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import {SecretValue} from "aws-cdk-lib";

class RestrictedPushUserStack extends cdk.Stack {
    constructor(scope: Construct, constructId: string, repo: codecommit.Repository, ...kwargs: any) {
        super(scope, constructId, ...kwargs);

        const user = new iam.User(this, 'RestrictedUser', {
            managedPolicies: [iam.ManagedPolicy.fromManagedPolicyArn(scope,constructId,'arn:aws:iam::aws:policy/AmazonCodeCommitPowerUser')],
        });
        // Policy to deny push to dev and master branches
        const restrictPushPolicy = new iam.Policy(this, 'RestrictPushPolicy', {
            statements: [
                new iam.PolicyStatement({
                    effect: iam.Effect.DENY,
                    actions: ['codecommit:GitPush'],
                    resources: [repo.repositoryArn],
                    conditions: {
                        StringEqualsIfExists: {
                            'codecommit:References': ['refs/heads/dev', 'refs/heads/master'],
                        },
                    },
                }),
            ],
        });

        // Attach the restrictive policy to the user
        user.attachInlinePolicy(restrictPushPolicy);
    }
}

// lib/vpc-quarkus-app-dev.ts



export function createRestrictPushPolicy(scope: Construct, constructId: string)  {
    const user = new iam.User(scope, 'RestrictedUser', {
        managedPolicies: [iam.ManagedPolicy.fromManagedPolicyArn(scope,constructId,'arn:aws:iam::aws:policy/AWSCodeCommitPowerUser')],
        userName:'test123',
        passwordResetRequired: false,
        password: new SecretValue('123456aA@'),
    });

    return user;
}

