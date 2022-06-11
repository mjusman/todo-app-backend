const AWS = require("aws-sdk");
const util = require("../utils/util");
AWS.config.update({
  region: "your-region",
});

// DynamoDB/Table Name declaration
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = "todo-items";

async function editTodoItem(todo) {
  // body...
  const todoId = todo.id;
  if (!todoId || todoId === "undefined") {
    util.buildResponse(401, {
      message: " Enter todo Id",
    });
  }
  //checks weather the todo id exist
  const checkIdResponse = await checkTodoId(todoId);
  if (!checkIdResponse) {
    return util.buildResponse(503, {
      message: "Id does not exits",
    });
  }
  const editTodoResponse = await editTodo(todo);
  if (!editTodoResponse) {
    return util.buildResponse(503, { message: "Server error" });
  }
  return util.buildResponse(200, {
    message: "A Todo with " + todoId + " edited successfully",
  });
}

async function checkTodoId(todoId) {
  // body...
  const params = {
    TableName: tableName,
    Key: { id: todoId },
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
async function editTodo(todo) {
  // body...
  const params = {
    TableName: tableName,
    Key: { id: todo.id },
    // update expression that specifies which field to be updated.
    UpdateExpression: "set title = :title, completed = :completed",

    // set update values to the specified fields
    ExpressionAttributeValues: {
      ":title": todo.title,
      ":completed": todo.completed,
    },
    ReturnValues: "UPDATED_NEW",
  };
  return await dynamodb
    .update(params)
    .promise()
    .then(
      () => {
        return true;
      },
      (error) => {
        console.error("There is an error getting todo id"), error;
      }
    );
}

module.exports.editTodoItem = editTodoItem;
