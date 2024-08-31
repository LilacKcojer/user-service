const cdk = require('aws-cdk-lib');
const dynamodb = require('aws-cdk-lib/aws-dynamodb');
const apigateway = require('aws-cdk-lib/aws-apigateway');
const lambda = require('aws-cdk-lib/aws-lambda');
const { NodejsFunction } = require('aws-cdk-lib/aws-lambda-nodejs');
const eventsources = require('aws-cdk-lib/aws-lambda-event-sources');
const sns = require('aws-cdk-lib/aws-sns');
const lambdaEventSources = require('@aws-cdk/aws-lambda-event-sources');
const iam = require('aws-cdk-lib/aws-iam');


class CdkStack extends cdk.Stack {
  /**
   * @param {cdk.App} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const usersTable = new dynamodb.TableV2(this, 'UsersTable', {
      partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING},
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName: "UsersTable",
      dynamoStream: dynamodb.StreamViewType.NEW_IMAGE
    });

    const usersServiceLambda = new NodejsFunction(this, 'UsersLambda', {
      entry: '../../lambdas/usersLambda.js',
      handler: 'handler',
      environment: {
        TABLE_NAME: usersTable.tableName,
      },
    });

    const newUserSNSPublishLambda = new NodejsFunction(this, 'NewUserPublishLambda', {
      entry: '../../lambdas/newUserPublishLambda.js',
      handler: 'handler',
      environment: {
        TABLE_NAME: usersTable.tableName,
      },
    });

    newUserSNSPublishLambda.addEventSource(new eventsources.DynamoEventSource(usersTable, {
        startingPosition: lambda.StartingPosition.LATEST,
        filters: [lambda.FilterCriteria.filter({ eventName: lambda.FilterRule.isEqual('INSERT') })]
    }));

    const api = new apigateway.LambdaRestApi(this, 'UsersServiceApi', {
      restApiName: "UsersServiceApi",
      handler: usersServiceLambda,
      defaultCorsPreflightOptions: {
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowCredentials: true,
        allowOrigins: ['*'],
      }
    });

    usersTable.grantReadWriteData(usersServiceLambda);
    usersTable.grantReadWriteData(newUserSNSPublishLambda);

    const newUserTopic = new sns.Topic(this, 'newUserTopic', {
      displayName: "newUserTopic",
      topicName: "newUsertopic"
    });

    newUserTopic.grantPublish(newUserSNSPublishLambda);

    const newUserSNSSubscribeLambda = new NodejsFunction(this, "newUserSNSSubscribeLambda", {
      entry: '../../lambdas/newUserSubscribeLambda.js',
      handler: 'handler',
    })

    newUserSNSSubscribeLambda.addEventSource(new eventsources.SnsEventSource(newUserTopic));

    newUserSNSSubscribeLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['ses:SendEmail', 'SES:SendRawEmail', 'ses:VerifyEmailIdentity'],
      resources: ['*'],
      effect: iam.Effect.ALLOW,
    }));

  }
}

module.exports = { CdkStack }
