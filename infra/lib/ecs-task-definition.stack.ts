import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import {RetentionDays} from 'aws-cdk-lib/aws-logs';

interface TaskDefinitionConfig {
    cpu: number;
    memoryLimitMiB: number;
    name: string;
    family: string;
    containerImage: ecr.Repository;
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

        const executionRole = this.createExecutionRole();

        const taskDefinition = new ecs.FargateTaskDefinition(this, 'DevEcommerceTaskDefinition', {
            cpu: props.taskDefinitionConfig.cpu,
            memoryLimitMiB: props.taskDefinitionConfig.memoryLimitMiB,
            executionRole: executionRole,
            family: props.taskDefinitionConfig.family,
        });

        const logGroup = new logs.LogGroup(this, 'EcommerceLogGroup', {
            logGroupName: 'DevEcommerceContainerLG',
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            retention: RetentionDays.FIVE_MONTHS,
        });


        taskDefinition.addContainer(props.taskDefinitionConfig.name, {
            image: ecs.ContainerImage.fromEcrRepository(props.taskDefinitionConfig.containerImage),
            logging: ecs.LogDrivers.awsLogs({streamPrefix: 'task-definition', logGroup: logGroup}),
            portMappings: [{containerPort: 8080, protocol: ecs.Protocol.TCP}],
        });

        this.taskDefinition = taskDefinition;
    }

    private createExecutionRole(): iam.Role {
        const role = new iam.Role(this, 'TaskExecutionRole', {
            assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
            description: 'Role provides the ECS tasks with permissions to run',
            roleName: "DevEcommerceTaskExecutionRole"
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
