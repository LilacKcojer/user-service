
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const {v4: uuid} = require("uuid");

const client = new DynamoDBClient({ region: "us-west-2"});
const docClient = DynamoDBDocumentClient.from(client);


/* new user into database */
const addUser = async({email}) => {

  const currentDate = new Date().toDateString();

  const command = new PutCommand({
    TableName: "userTable",
    Item: {
      email,
      dateAdded: currentDate,
      userId: uuid(),
    },
  });
  console.log(currentDate);
  const response = await docClient.send(command);
  console.log(response);
  return response;
};

module.exports = {addUser};