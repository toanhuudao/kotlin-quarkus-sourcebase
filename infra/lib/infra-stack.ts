import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {VpcStack} from './vpc-stack';
import {RdsStack} from "./rds-stack";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export class InfraStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const vpcStack = new VpcStack(this, 'VpcQuarkusAppDev');
        new RdsStack(this, 'RdsStack', {
            dbAllocatedStorage: 20,
            dbInstanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
            dbName: "testdb",
            vpc: vpcStack.vpc});
    }
}
