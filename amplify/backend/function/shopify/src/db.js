const AWS = require('aws-sdk')
const { LOGGER } = require('./helpers')

const skipEmptyValue = obj => {
  return Object.entries(obj).reduce(
    (a, [k, v]) => (v.Value ? ((a[k] = v), a) : a),
    {}
  )
}

const dynamo = new AWS.DynamoDB.DocumentClient()

async function updateStore(storeId, props = {}) {
  LOGGER(props, 'updateStore props')
  const params = {
    TableName: 'shopifyappdb-dev',
    Key: {
      store_id: storeId
    },
    ReturnValues: 'UPDATED_NEW',
    AttributeUpdates: skipEmptyValue({
      nonce: { Action: 'PUT', Value: props.nonce },
      access_token: { Action: 'PUT', Value: props.accessToken }
    })
  }
  try {
    const res = await dynamo.update(params).promise()
    LOGGER(JSON.stringify(res), 'Dynamo update result')
  } catch (err) {
    return err
  }
}

async function deleteAttribute(storeId, attribute) {
  const params = {
    TableName: 'shopifyappdb-dev',
    Key: {
      store_id: storeId
    },
    ReturnValues: 'UPDATED_NEW',
    AttributeUpdates: {
      [attribute]: { Action: 'DELETE' }
    }
  }
  try {
    const res = await dynamo.update(params).promise()
    LOGGER(JSON.stringify(res), 'Dynamo delete result')
  } catch (err) {
    return err
  }
}

async function deleteStore(storeId) {
  const params = {
    Key: {
      store_id: storeId
    },
    TableName: 'shopifyappdb-dev'
  }
  try {
    const data = await dynamo.delete(params).promise()
    return data
  } catch (err) {
    return {}
  }
}

async function getStoreInfo(storeId) {
  const params = {
    Key: {
      store_id: storeId
    },
    TableName: 'shopifyappdb-dev'
  }
  try {
    const data = await dynamo.get(params).promise()
    LOGGER(data, 'Store info')
    return data.Item
  } catch (err) {
    return {}
  }
}

module.exports = {
  updateStore,
  getStoreInfo,
  deleteStore,
  deleteAttribute
}
