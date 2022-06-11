const AWS = require("aws-sdk");
const util = require("../utils/util");
AWS.config.update({
  region: "your-region",
});

// DynamoDB/Table Name declaration
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = "todo-items";
let scanResults = []; // an array which holds the returned data
let items;

async function getTodoItems() {
  // body...
  const params = {
    TableName: tableName,
  };

  items = await dynamodb.scan(params).promise();

  // loop which push each item data to the empty array
  items.Items.forEach((item) => scanResults.push(item));

  return util.buildResponse(200, { scanResults });
}

module.exports.getTodoItems = getTodoItems;
