exports.handler = async event => {
  // TODO implement
  const response = {
    statusCode: 302,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  },
    headers: {
      Location: "https://google.com"
    }
  };
  return response;
};
