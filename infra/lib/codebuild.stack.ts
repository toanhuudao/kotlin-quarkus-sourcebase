import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import { ComputeType } from 'aws-cdk-lib/aws-codebuild';
import * as logs from 'aws-cdk-lib/aws-logs';

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
            logGroupName: `${props.projectName}//${props.branchName}/codebuild/logs`,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            retention: logs.RetentionDays.ONE_MONTH,
        });

        const project = new codebuild.Project(this, props.projectName, {
            source: codebuild.Source.codeCommit({ repository: props.repository, branchOrRef: `refs/heads/${props.branchName}` }),
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
        });
    }
}
