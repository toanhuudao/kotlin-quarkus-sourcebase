// lib/vpc-quarkus-app-dev.ts

import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export function createVpcQuarkusAppDev(scope: Construct): ec2.Vpc {
    const vpc = new ec2.Vpc(scope, 'VpcQuarkusAppDev', {
        maxAzs: 3,
        ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
        vpcName: 'VpcQuarkusAppDev',
        subnetConfiguration: [
            {
                cidrMask: 24,
                name: 'PublicSubnet',
                subnetType: ec2.SubnetType.PUBLIC,
            },
            {
                cidrMask: 24,
                name: 'PrivateSubnet',
                subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
            },
        ],
    });

    return vpc;
}
