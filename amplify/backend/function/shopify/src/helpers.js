const queryString = require('query-string')

function LOGGER(msg, title = '') {
  if (msg && typeof msg === 'object' && msg.constructor === Object) {
    msg = JSON.stringify(msg)
  }
  console.log(`**${title}******************\n${msg}\n`)
}

function getQueryParameters(event) {
  let queryParameters
  if (
    typeof event.queryStringParameters === 'string' ||
    event.queryStringParameters instanceof String
  ) {
    queryParameters = queryString.parse(event.queryStringParameters)
  } else if (
    event.queryStringParameters &&
    typeof event.queryStringParameters === 'object' &&
    event.queryStringParameters.constructor === Object
  ) {
    queryParameters = event.queryStringParameters
  } else {
    queryParameters = {}
  }

  return queryParameters
}

module.exports = {
  LOGGER,
  getQueryParameters
}
