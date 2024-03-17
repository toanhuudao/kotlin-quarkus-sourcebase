import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';

export class CodeCommitStack extends cdk.Stack {
    public readonly repository: codecommit.Repository;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.repository = new codecommit.Repository(this, 'EcommerceRepository', {
            repositoryName: 'e-commerce'
        });
    }
}
