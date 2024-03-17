import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import {ComputeType} from 'aws-cdk-lib/aws-codebuild';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam';

interface CodeBuildStackProps extends cdk.StackProps {
    branchName: string;
    buildSpecFile: string;
    projectName: string;
    environment?: codebuild.BuildEnvironment;
    repository: codecommit.Repository
}

export class CodeBuildStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: CodeBuildStackProps) {
        super(scope, id, props);

        const logGroup = new logs.LogGroup(this, `${props.projectName}LogGroup`, {
            logGroupName: `${props.projectName}/${props.branchName}/codebuild/logs`,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            retention: logs.RetentionDays.ONE_MONTH,
        });

        const ecrPolicy = new iam.Policy(this, 'ECRPolicy', {
            policyName: 'CodeBuildECRPolicy',
            statements: [
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: [
                        'ecr:GetAuthorizationToken',
                        'ecr:BatchCheckLayerAvailability',
                        'ecr:InitiateLayerUpload',
                        'ecr:UploadLayerPart',
                        'ecr:CompleteLayerUpload',
                        'ecr:PutImage',
                    ],
                    resources: ['*'],
                }),
            ],
        });

        const codeBuildLogPolicy = new iam.Policy(this, 'CodeBuildLogPolicy', {
            statements: [
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: [
                        'logs:CreateLogGroup',
                        'logs:CreateLogStream',
                        'logs:PutLogEvents',
                    ],
                    resources: [
                        `arn:aws:logs:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:log-group:${logGroup.logGroupName}:log-stream:*`,
                        `arn:aws:logs:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:log-group:${logGroup.logGroupName}`,
                    ],
                }),
            ],
        });



        const codeBuildRole = new iam.Role(this, 'CodeBuildRole', {
            assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
        });
        codeBuildRole.attachInlinePolicy(ecrPolicy);
        codeBuildRole.attachInlinePolicy(codeBuildLogPolicy);

        const project = new codebuild.Project(this, props.projectName, {
            source: codebuild.Source.codeCommit({
                repository: props.repository,
                branchOrRef: `refs/heads/${props.branchName}`
            }),
            environment: props.environment || {
                buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
                computeType: ComputeType.SMALL,
            },
            buildSpec: codebuild.BuildSpec.fromSourceFilename(props.buildSpecFile),
            logging: {
                cloudWatch: {
                    logGroup: logGroup, enabled: true, prefix: 'build-'
                },
            }
            ,
            role: codeBuildRole,
            projectName: props.projectName,
        });


    }
}
