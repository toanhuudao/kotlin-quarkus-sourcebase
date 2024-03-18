import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {VpcStack} from './vpc-stack';
import {RdsStack} from './rds-stack';
import {DeveloperUserStack} from "./developer-user.stack";
import {DeveloperGroupStack} from "./developer-group.stack";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import {CodeCommitStack} from "./codecommit.stack";
import {CodeBuildStack} from "./codebuild.stack";
import {EcrStack} from "./ecr.stack";
import {EcsTaskDefinitionStack} from "./ecs-task-definition.stack";
import {AlbStack} from "./alb.stack";

export class InfraStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const vpcStack = new VpcStack(this, 'VpcStack');

        new RdsStack(this, 'RdsStack', {
            vpc: vpcStack.vpc,
            dbName: 'ecommerce',
            dbInstanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
            dbAllocatedStorage: 20
        });

        const codeCommitStack = new CodeCommitStack(this, 'CodeCommitStack');

        const developerGroupStack = new DeveloperGroupStack(this, 'DeveloperGroupStack', {repository: codeCommitStack.repository});

        new DeveloperUserStack(this, 'DeveloperUserStackTommy', {
            userName: 'tommy',
            password: '123456aA@',
            developerGroup: developerGroupStack.developerGroup
        });

        const devBEStack = new CodeBuildStack(this, 'DevBECodeBuildStack', {
            branchName: 'develop',
            buildSpecFile: 'buildspec_dev.yml',
            projectName: 'DevBEEcommerceCodeBuildProject',
            repository: codeCommitStack.repository,
        })

        const erc = new EcrStack(this, 'DevEcommerceErcStack', {repositoryName: 'e-commerce'})

        const albStack = new AlbStack(this, 'devEcommerceAlb', {vpc: vpcStack.vpc})


        const t1 = new EcsTaskDefinitionStack(this, 'taskDefinition1', {
            vpc: vpcStack.vpc,
            taskDefinitionConfig: {
                cpu: 256,
                containerImage: erc.repository,
                memoryLimitMiB: 512,
                name: 'test-td-1',
                targetGroup: albStack.targetGroup
            }
        })



    }
}
