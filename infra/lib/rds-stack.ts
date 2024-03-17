import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';

interface RdsStackProps extends cdk.StackProps {
    vpc: ec2.Vpc;
    dbName: string;
    dbInstanceType: ec2.InstanceType;
    dbAllocatedStorage: number;
}

export class RdsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: RdsStackProps) {
        super(scope, id, props);

        const dbSecurityGroup = new ec2.SecurityGroup(this, 'DBSecurityGroup', {
            vpc: props.vpc,
            allowAllOutbound: true,
            securityGroupName: 'DBSecurityGroup',
        });

        dbSecurityGroup.addIngressRule(
            ec2.Peer.anyIpv4(),
            ec2.Port.tcp(5432),
            'Allow PostgreSQL access'
        );

        const dbInstance = new rds.DatabaseInstance(this, id, {
            engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_16_2 }),
            instanceType: props.dbInstanceType,
            vpc: props.vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PUBLIC,
            },
            securityGroups: [dbSecurityGroup],
            allocatedStorage: props.dbAllocatedStorage,
            backupRetention: cdk.Duration.days(7),
            deletionProtection: false,
            databaseName: props.dbName,
            credentials: rds.Credentials.fromPassword('postgres', new cdk.SecretValue('postgres')),
            instanceIdentifier: 'dev-ecommerce-db'
        });
    }
}
