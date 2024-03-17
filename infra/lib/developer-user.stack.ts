import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { SecretValue } from 'aws-cdk-lib';

interface DeveloperUserProps extends cdk.StackProps {
    userName: string;
    password: string;
    developerGroup: iam.Group;
}

export class DeveloperUserStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: DeveloperUserProps) {
        super(scope, id, props);

        const iamUser = new iam.User(this, `${props.userName}Developer`, {
            userName: props.userName,
            password: SecretValue.unsafePlainText(props.password),
        });

        props.developerGroup.addUser(iamUser);
    }
}
