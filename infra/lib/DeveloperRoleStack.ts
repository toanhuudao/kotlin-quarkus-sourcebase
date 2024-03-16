import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { SecretValue } from 'aws-cdk-lib';
import { Effect } from 'aws-cdk-lib/aws-iam';

export class DeveloperRoleStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const users = ['tommy'];

        for (const userName of users) {
            // Create an IAM user
            const user = new iam.User(this, `${userName}User`, {
                userName: userName,
                password: SecretValue.unsafePlainText('123456aA@')
            });

            // Define the policy statement for viewing the "ecommerce" repository
            const codeCommitPolicyStatement = new iam.PolicyStatement({
                actions: [
                    "codecommit:BatchGetRepositories",
                    "codecommit:Get*",
                    "codecommit:List*",
                    "codecommit:GitPull"
                ],
                resources: [`arn:aws:codecommit:${this.region}:${this.account}:ecommerce`],
                effect: Effect.ALLOW
            });

            // Define a separate policy statement to allow listing all repositories in the account
            const listRepositoriesPolicyStatement = new iam.PolicyStatement({
                actions: [
                    "codecommit:ListRepositories"
                ],
                resources: ["*"],
                effect: Effect.ALLOW
            });

            // Define a policy statement to allow creating merge requests for "develop" and "master" branches
            const mergeRequestPolicyStatement = new iam.PolicyStatement({
                actions: [
                    "codecommit:CreatePullRequest",
                    "codecommit:UpdatePullRequestStatus",
                    "codecommit:MergePullRequestByFastForward"
                ],
                resources: [`arn:aws:codecommit:${this.region}:${this.account}:ecommerce`],
                effect: Effect.ALLOW
            });

            // Define a policy statement to deny pushing to "develop" and "master" branches
            const denyPushPolicyStatement = new iam.PolicyStatement({
                actions: [
                    "codecommit:GitPush"
                ],
                resources: [
                    `arn:aws:codecommit:${this.region}:${this.account}:ecommerce/refs/heads/develop`,
                    `arn:aws:codecommit:${this.region}:${this.account}:ecommerce/refs/heads/master`
                ],
                effect: Effect.DENY
            });

            // Create a policy and attach it to the user
            const policy = new iam.Policy(this, `${userName}Policy`, {
                policyName: `${userName}-policy`,
                statements: [
                    codeCommitPolicyStatement,
                    listRepositoriesPolicyStatement,
                    mergeRequestPolicyStatement,
                    denyPushPolicyStatement
                ],
            });

            user.attachInlinePolicy(policy);
        }
    }
}
