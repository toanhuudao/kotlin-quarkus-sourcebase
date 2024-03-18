import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

interface EcsServiceStackProps extends cdk.StackProps {
    vpc: ec2.Vpc;
    cluster: ecs.Cluster;
    taskDefinition: ecs.FargateTaskDefinition;
    serviceName: string
}

export class EcsServiceStack extends cdk.Stack {
    public readonly service: ecs.FargateService;

    constructor(scope: Construct, id: string, props: EcsServiceStackProps) {
        super(scope, id, props);

        const securityGroup = new ec2.SecurityGroup(this, 'EcsServiceSecurityGroup', {
            vpc: props.vpc,
            allowAllOutbound: true,
            description: 'Security group for the ECS service',
            securityGroupName: 'dev-ecommerce-service',
        });
        securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(8080), 'Allow HTTP traffic');

        this.service = new ecs.FargateService(this, 'EcsService', {
            cluster: props.cluster,
            taskDefinition: props.taskDefinition,
            desiredCount: 1,
            assignPublicIp: true,
            vpcSubnets: {subnetType: ec2.SubnetType.PUBLIC},
            securityGroups: [securityGroup],
            serviceName: props.serviceName,
        });
    }
}
