var express = require('express');
var router = express.Router();

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "us-west-2"});
const docClient = DynamoDBDocumentClient.from(client);


/* new user into database */
router.post('/', async(req, res) => {

  const currentDate = new Date().toDateString();
  const data = req.body;
  const userID = data.username;

  const command = new PutCommand({
    TableName: "CdkStack-UserTableBD4BF69E-773Y23AC1FT7",
    Item: {
      username: userID,
      dateAdded: currentDate,
    },
  });
  console.log(data);
  console.log(currentDate);
  const response = await docClient.send(command);
  res.send("item added");
  console.log(response);
});

module.exports = router;
