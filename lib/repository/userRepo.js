
const { DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, DeleteCommand} = require("@aws-sdk/lib-dynamodb");
const {v4: uuid} = require("uuid");
const winston = require('winston');

const logger = winston.createLogger({level: 'info'});

const client = new DynamoDBClient({ region: "us-west-2"});
const docClient = DynamoDBDocumentClient.from(client);


const getUser = async({email}) => {
  const params = {
    TableName: "UsersTable",
    Key: {
      'email': email
    }
  };

  const user = await docClient.send(new GetCommand(params));

  return user;
}

const delUser = async({email}) => {
  const params = {
    TableName: "UsersTable",
    Key: {
      'email': email
    }
  };

  const user = await docClient.send(new DeleteCommand(params));

  return user;
}

module.exports = {getUser, delUser};