const cdk = require('aws-cdk-lib');
const dynamodb = require('aws-cdk-lib/aws-dynamodb');
const apigateway = require('aws-cdk-lib/aws-apigateway');
const { NodejsFunction } = require('aws-cdk-lib/aws-lambda-nodejs');

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
      tableName: "UsersTable"
    });

    const usersServiceLambda = new NodejsFunction(this, 'UsersLambda', {
      entry: '../../lambdas/usersLambda.js',
      handler: 'handler',
      environment: {
        TABLE_NAME: usersTable.tableName,
      },
    })

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
    })

    usersTable.grantReadWriteData(usersServiceLambda);
  }
}

module.exports = { CdkStack }
