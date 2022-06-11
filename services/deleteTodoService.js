const AWS = require("aws-sdk");
const util = require("../utils/util");
AWS.config.update({
  region: "your-region",
});

// DynamoDB/Table Name declaration
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = "todo-items";
async function delTodoItem(todo) {
  const todoId = todo.id;
  // body...
  if (!todoId || todoId === "undefined") {
    return util.buildResponse(401, {
      message: "Invalid Id",
    });
  }
  const checkTodoIdResponse = await checkTodoId(todoId);
  if (!checkTodoIdResponse) {
    return util.buildResponse(401, {
      message: "Id does not exists",
    });
  }

  const delTodoResponse = await deleteTodo(todoId);
  if (!delTodoResponse) {
    return util.buildResponse(503, {
      message: "server error",
    });
  }
  return util.buildResponse(200, {
    message: "A Todo with " + todoId + " deleted succcessfully",
  });
}
async function checkTodoId(id) {
  // body...
  const params = {
    TableName: tableName,
    Key: {
      id: id,
    },
  };
  return await dynamodb
    .get(params)
    .promise()
    .then(
      (response) => {
        return response.Item;
      },
      (error) => {
        console.error("There is an error getting todo id"), error;
      }
    );
}

async function deleteTodo(todoId) {
  // body...
  const params = {
    TableName: tableName,
    Key: {
      id: todoId,
    },
  };
  return await dynamodb
    .delete(params)
    .promise()
    .then(
      () => {
        return true;
      },
      (error) => {
        console.error("Error deleting todo"), error;
      }
    );
}

module.exports.delTodoItem = delTodoItem;
