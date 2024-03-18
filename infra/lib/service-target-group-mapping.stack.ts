import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

interface ServiceTargetGroupMappingStackProps extends cdk.StackProps {
    service: ecs.FargateService;
    targetGroup: elbv2.ApplicationTargetGroup;
    containerName: string;
}

export class ServiceTargetGroupMappingStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: ServiceTargetGroupMappingStackProps) {
        super(scope, id, props);

        props.targetGroup.addTarget(props.service.loadBalancerTarget({
            containerName: props.containerName,
            containerPort: 8080,
        }));
    }
}
