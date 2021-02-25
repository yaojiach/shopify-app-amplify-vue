# shopify-app-amplify-vue[nuxt]

This is an attempt (and working version) to build a Shopify app using serverless components. I'm using AWS Amplify as its the simplest. The same stack can be defined and deployed using the underlying Cloudformation templates or CDK.

This project uses AWS Lambda and API Gateway to implement callbacks that Shopify would call during the Shopify app installation process. There are different API endpoints pointing to one single Lambda function. Basic information is stored in a DynamoDB table. 

The frontend is a simple one-page Nuxt app.

## Backend Setup

In `amplify` folder.
## Frontend Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
