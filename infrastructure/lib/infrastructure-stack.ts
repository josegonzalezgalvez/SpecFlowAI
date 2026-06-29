import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const knowledgeBucket = new s3.Bucket(this, "SpecFlowKnowledgeBucket", {
      bucketName: `specflow-ai-knowledge-${this.account}-${this.region}`,
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    cdk.Tags.of(this).add("Project", "SpecFlowAI");
    cdk.Tags.of(this).add("Environment", "dev");

    new cdk.CfnOutput(this, "KnowledgeBucketName", {
      value: knowledgeBucket.bucketName,
    });

    const projectsTable = new dynamodb.Table(this, "SpecFlowProjects", {
      tableName: "SpecFlowProjects",
      partitionKey: {
        name: "ProjectId",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new cdk.CfnOutput(this, "ProjectsTableName", {
      value: projectsTable.tableName,
    });
  }
}