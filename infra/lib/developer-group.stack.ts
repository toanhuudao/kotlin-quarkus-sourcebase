import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import {Effect} from "aws-cdk-lib/aws-iam";
import * as codecommit from 'aws-cdk-lib/aws-codecommit';

interface DeveloperGroupStackProps extends cdk.StackProps {
    repository: codecommit.Repository;
}


export class DeveloperGroupStack extends cdk.Stack {
    public readonly developerGroup: iam.Group;

    constructor(scope: Construct, id: string, props: DeveloperGroupStackProps) {
        super(scope, id, props);
        this.developerGroup = new iam.Group(this, 'DeveloperGroup', {
            groupName: 'developers',
        });

        const codeCommitPolicyStatement = new iam.PolicyStatement({
            actions: [
                "codecommit:BatchGetRepositories",
                "codecommit:Get*",
                "codecommit:List*",
                "codecommit:GitPull",
            ],
            resources: [props.repository.repositoryArn],
            effect: Effect.ALLOW
        });

        const listRepositoriesPolicyStatement = new iam.PolicyStatement({
            actions: [
                "codecommit:ListRepositories"
            ],
            resources: ["*"],
            effect: Effect.ALLOW
        });

        const mergeRequestPolicyStatement = new iam.PolicyStatement({
            actions: [
                "codecommit:CreatePullRequest",
                "codecommit:UpdatePullRequestStatus",
                "codecommit:GitPush",
            ],
            resources: [props.repository.repositoryArn],
            effect: Effect.ALLOW
        });

        const denyPushPolicyStatement = new iam.PolicyStatement({
            actions: [
                "codecommit:GitPush"
            ],
            resources: [props.repository.repositoryArn],
            effect: Effect.DENY,
            conditions: {
                'StringLike': {
                    'codecommit:References': [
                        'refs/heads/develop',
                        'refs/heads/master',
                    ],
                },
            },
        });


        const readOnlyPolicyStatement = new iam.PolicyStatement({
            actions: [
                "logs:GetLogEvents",
                "logs:DescribeLogStreams",
                "logs:DescribeLogGroups",
                "cloudwatch:GetMetricData",
                "iam:Get*",
                "iam:List*",
            ],
            resources: [
                "*"
            ],
            effect: Effect.ALLOW
        });

        const policy = new iam.Policy(this, 'DeveloperPolicy', {
            policyName: 'developer-policy',
            statements: [
                codeCommitPolicyStatement,
                listRepositoriesPolicyStatement,
                mergeRequestPolicyStatement,
                denyPushPolicyStatement,
                readOnlyPolicyStatement
            ],
        });

        this.developerGroup.attachInlinePolicy(policy);
    }
}
