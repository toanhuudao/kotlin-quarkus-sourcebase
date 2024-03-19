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
import {EcsServiceStack} from "./ecs-service.stack";
import {ServiceTargetGroupMappingStack} from "./service-target-group-mapping.stack";
import * as ecs from "aws-cdk-lib/aws-ecs";
import {EcsClusterStack} from "./ecs-cluster.stack";

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


        // ecs
        const ecsClusterStack = new EcsClusterStack(this, 'EcsClusterStack', {
            vpc: vpcStack.vpc,
            clusterName: "dev-be-ecommerce-cluster"
        });

        const taskDefinitionStack = new EcsTaskDefinitionStack(this, 'TaskDefinitionStack', {
            vpc: vpcStack.vpc,
            taskDefinitionConfig: {
                cpu: 256,
                memoryLimitMiB: 512,
                containerImage: erc.repository,
                name: 'ecommerce-container',
                family: 'dev-be-ecommerce-td',
            }
        })


        const ecsServiceStack = new EcsServiceStack(this, 'EcsServiceStack', {
            vpc: vpcStack.vpc,
            cluster: ecsClusterStack.cluster,
            taskDefinition: taskDefinitionStack.taskDefinition,
            serviceName: "dev-be-ecommerce-service"
        });


        // alb and target group creation
        const albStack = new AlbStack(this, 'DevEcommerceAlb', {vpc: vpcStack.vpc})


        // mapping ecs service with target group alb
        const serviceTargetGroupMappingStack = new ServiceTargetGroupMappingStack(this, 'ServiceTargetGroupMappingStack', {
            service: ecsServiceStack.service,
            targetGroup: albStack.targetGroup,
            containerName: 'ecommerce-container',
        });


    }
}
