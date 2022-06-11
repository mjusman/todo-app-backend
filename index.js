// required modules
const util = require("./utils/util");
const addTodoService = require("./services/addTodoService");
const getTodoService = require("./services/getTodoService");
const delTodoService = require("./services/deleteTodoService");
const editTodoService = require("./services/editTodoService");

// Paths variable declarations
const healthPath = "/health";
const addTodoPath = "/add-todo";
const getTodosPath = "/get-todos";
const delTodoPath = "/delete-todo";
const editTodoPath = "/edit-todo";

exports.handler = async (event) => {
  console.log("Request Event", event);
  let response;
  switch (true) {
    case event.httpMethod === "GET" && event.path === healthPath:
      response = util.buildResponse(200);
      break;
    case event.httpMethod === "POST" && event.path === addTodoPath:
      const addTodoBody = JSON.parse(event.body);
      response = await addTodoService.addTodoItem(addTodoBody);
      break;
    case event.httpMethod === "POST" && event.path === getTodosPath:
      response = await getTodoService.getTodoItems();
      break;
    case event.httpMethod === "POST" && event.path === delTodoPath:
      const delTodoBody = JSON.parse(event.body);
      response = delTodoService.delTodoItem(delTodoBody);
      break;
    case event.httpMethod === "POST" && event.path === editTodoPath:
      const editTodoBody = JSON.parse(event.body);
      response = editTodoService.editTodoItem(editTodoBody);
      break;
    default:
      response = util.buildResponse(404, "Request not found");
  }
  return response;
};
