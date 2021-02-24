/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_SHOPIFYAPPDB_ARN
	STORAGE_SHOPIFYAPPDB_NAME
Amplify Params - DO NOT EDIT */
const { v4: uuidv4 } = require('uuid')
const Shopify = require('shopify-api-node')
const { LOGGER, getQueryParameters } = require('./helpers')
const {
  verifyShopify,
  generateInstallRedirectUrl,
  getAccessToken,
  generatePostInstallRedirectUrl
} = require('./auth')
const {
  updateStore,
  getStoreInfo,
  deleteStore,
  deleteAttribute
} = require('./db')

exports.handler = async event => {
  try {
    verifyShopify(event)
  } catch {
    return {
      statusCode: 401
    }
  }

  // const requestBody = JSON.parse(event.body || '{}')
  const queryParameters = getQueryParameters(event)
  const shop = queryParameters.shop

  let response
  let shopInfo
  let nonce

  switch (event.path) {
    case '/shopify':
      shopInfo = await getStoreInfo(shop)
      if (shopInfo && shopInfo.access_token) {
        // redirect to home page
        response = {
          statusCode: 302,
          headers: {
            Location: process.env.FRONTEND_URL
          }
        }
      } else {
        // redirect to install
        nonce = uuidv4()
        await updateStore(shop, { nonce })
        response = {
          statusCode: 302,
          headers: {
            Location: generateInstallRedirectUrl(shop, nonce)
          }
        }
      }
      break
    case '/install':
      shopInfo = await getStoreInfo(shop)
      if (queryParameters.state !== shopInfo.nonce) {
        LOGGER(
          `${queryParameters.state}<>${shopInfo.nonce}`,
          'Not matching, delete nonce'
        )
        await deleteAttribute(shop, 'nonce')
        response = {
          statusCode: 401
        }
      } else {
        LOGGER('Requesting access token')
        const accessToken = await getAccessToken(shop, queryParameters.code)
        await updateStore(shop, { accessToken })
        await deleteAttribute(shop, 'nonce')
        const shopify = new Shopify({
          shopName: shop,
          accessToken: accessToken
        })
        shopify.webhook.create({
          address: process.env.WEBHOOK_APP_UNINSTALL_URL,
          topic: 'app/uninstalled'
        })
        response = {
          statusCode: 302,
          headers: {
            Location: generatePostInstallRedirectUrl(shop)
          }
        }
      }
      break
    case '/uninstall':
      await deleteStore(event.headers['X-Shopify-Shop-Domain'])
      response = {
        statusCode: 200,
        body: 'Uninstall'
      }
      break
    default:
      response = {
        statusCode: 404
      }
  }

  return response
}
