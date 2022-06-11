// function that returns build response to the client request.
function buildResponse(statusCode, body) {
  // body...
  return {
    isBase64Encoded: false,
    statusCode: statusCode,

    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "Application/json",
    },
    body: JSON.stringify(body),
  };
}
module.exports.buildResponse = buildResponse;