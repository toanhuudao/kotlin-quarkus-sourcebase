import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

interface AlbStackProps extends cdk.StackProps {
    vpc: ec2.Vpc;
}

export class AlbStack extends cdk.Stack {
    public readonly loadBalancer: elbv2.ApplicationLoadBalancer;
    public readonly listener: elbv2.ApplicationListener;
    public readonly targetGroup: elbv2.ApplicationTargetGroup;

    constructor(scope: Construct, id: string, props: AlbStackProps) {
        super(scope, id, props);

        this.loadBalancer = new elbv2.ApplicationLoadBalancer(this, 'ALB', {
            vpc: props.vpc,
            internetFacing: true,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PUBLIC,
                onePerAz: true,
            },
            loadBalancerName: 'DevEcommerceALB'
        });

        this.listener = this.loadBalancer.addListener('Listener', {
            port: 80,
            open: true,
        });

        this.targetGroup = new elbv2.ApplicationTargetGroup(this, 'TargetGroup', {
            vpc: props.vpc,
            targetType: elbv2.TargetType.IP,
            port: 8080,
            targetGroupName: "devBeEcommerceTG"
        });

        this.listener.addTargetGroups('TargetGroupListener', {
            targetGroups: [this.targetGroup],
        });
    }
}
