import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';

interface TaskDefinitionConfig {
    cpu: number;
    memoryLimitMiB: number;
    name: string;
    containerImage: ecr.Repository;
    targetGroup: elbv2.ApplicationTargetGroup;
}

interface EcsTaskDefinitionStackProps extends cdk.StackProps {
    vpc: ec2.Vpc;
    taskDefinitionConfig: TaskDefinitionConfig;
}

export class EcsTaskDefinitionStack extends cdk.Stack {
    public readonly taskDefinition: ecs.FargateTaskDefinition;
    public readonly cluster: ecs.Cluster;
    public readonly service: ecs.FargateService;

    constructor(scope: Construct, id: string, props: EcsTaskDefinitionStackProps) {
        super(scope, id, props);

        const cluster = new ecs.Cluster(this, 'EcsCluster', {
            vpc: props.vpc,
        });

        const executionRole = this.createExecutionRole();

        const taskDefinition = new ecs.FargateTaskDefinition(this, 'DevEcommerceTaskDefinition', {
            cpu: props.taskDefinitionConfig.cpu,
            memoryLimitMiB: props.taskDefinitionConfig.memoryLimitMiB,
            executionRole: executionRole,
            family: props.taskDefinitionConfig.name,
        });

        taskDefinition.addContainer(props.taskDefinitionConfig.name, {
            image: ecs.ContainerImage.fromEcrRepository(props.taskDefinitionConfig.containerImage),
            logging: ecs.LogDrivers.awsLogs({streamPrefix: 'task-definition'}),
            portMappings: [{containerPort: 8080, protocol: ecs.Protocol.TCP}],
        });

        const securityGroup = new ec2.SecurityGroup(this, 'EcsServiceSecurityGroup', {
            vpc: props.vpc,
            allowAllOutbound: true,
            description: 'Security group for the ECS service',
        });
        securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(8080), 'Allow HTTP traffic');

        const service = new ecs.FargateService(this, 'EcsService', {
            cluster,
            taskDefinition,
            desiredCount: 1,
            assignPublicIp: true,
            vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
            securityGroups: [securityGroup],
        });

        props.taskDefinitionConfig.targetGroup.addTarget(service.loadBalancerTarget({
            containerName: props.taskDefinitionConfig.name,
            containerPort: 8080,
        }));

        this.cluster = cluster;
        this.service = service;
        this.taskDefinition = taskDefinition;
    }

    private createExecutionRole(): iam.Role {
        const role = new iam.Role(this, 'TaskExecutionRole', {
            assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
            description: 'Role provides the ECS tasks with permissions to run',
        });

        role.addToPolicy(new iam.PolicyStatement({
            actions: [
                'ecr:GetAuthorizationToken',
                'ecr:BatchCheckLayerAvailability',
                'ecr:GetDownloadUrlForLayer',
                'ecr:BatchGetImage',
            ],
            resources: ['*'],
        }));

        role.addToPolicy(new iam.PolicyStatement({
            actions: [
                'logs:CreateLogStream',
                'logs:PutLogEvents',
            ],
            resources: ['arn:aws:logs:*:*:*'],
        }));

        return role;
    }
}
