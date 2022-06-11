const AWS = require("aws-sdk");
const util = require("../utils/util");
AWS.config.update({
  region: "your-region",
});

// DynamoDB/Table Name declaration
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = "todo-items";

async function addTodoItem(todoItem) {
  // body...
  const todoId = todoItem.id;
  const todoTitle = todoItem.title;
  const completedTodo = todoItem.completed;

  if (!todoId || !todoTitle || !completedTodo) {
    return util.buildResponse(401, {
      message: "Enter todo title first",
    });
  }
  // check if the entered todo id already exist
  const dynamoTodoId = await getTodoId(todoId);
  if (dynamoTodoId && dynamoTodoId.id) {
    return util.buildResponse(401, {
      message: "Id already exists",
    });
  }

  const newTodo = {
    id: todoId,
    title: todoTitle,
    completed: completedTodo,
  };

  const saveTodoResponse = await addNewTodo(newTodo);

  if (!saveTodoResponse) {
    return util.buildResponse(403, { message: "server error" });
  }

  return util.buildResponse(200, { message: "new todo added sussessfully" });
}

async function getTodoId(id) {
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
        console.error("There an error getting the todo id"), error;
      }
    );
}
async function addNewTodo(newTodo) {
  // body...
  const params = {
    TableName: tableName,
    Item: newTodo,
  };

  return await dynamodb
    .put(params)
    .promise()
    .then(
      () => {
        return true;
      },
      (error) => {
        console.error("There is an error saving user"), error;
      }
    );
}
module.exports.addTodoItem = addTodoItem;
