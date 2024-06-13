
const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const {v4: uuid} = require("uuid");
const winston = require('winston');

const logger = winston.createLogger({level: 'info'});

const client = new DynamoDBClient({ region: "us-west-2"});
const docClient = DynamoDBDocumentClient.from(client);


/* new user into database */
const addUser = async({email}) => {

  const currentDate = new Date().toDateString();

  const item = {
    email,
    dateAdded: currentDate,
    userId: uuid(),
  };

  const command = new PutCommand({
    TableName: "UsersTable",
    Item: item
  });

  await docClient.send(command);

  logger.info(`Successfully added user: ${JSON.stringify(item)}`);
  return item;
};

const getUsers = async() => {
  const params = {
    TableName: "UsersTable",
  };

  const command = new ScanCommand(params);
  const response = await client.send(command);

  return response;
}

module.exports = {addUser, getUsers};