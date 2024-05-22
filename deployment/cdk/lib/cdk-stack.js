const cdk = require('aws-cdk-lib');
const sns = require('aws-cdk-lib/aws-sns');
const subs = require('aws-cdk-lib/aws-sns-subscriptions');
const sqs = require('aws-cdk-lib/aws-sqs');
const dynamodb = require('aws-cdk-lib/aws-dynamodb');

class CdkStack extends cdk.Stack {
  /**
   * @param {cdk.App} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, 'CdkQueue', {
      visibilityTimeout: cdk.Duration.seconds(300)
    });

    const topic = new sns.Topic(this, 'CdkTopic');

    topic.addSubscription(new subs.SqsSubscription(queue));

    const userTable = new dynamodb.TableV2(this, 'UserTable', {
      partitionKey: { name: 'username', type: dynamodb.AttributeType.STRING},
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}

module.exports = { CdkStack }
