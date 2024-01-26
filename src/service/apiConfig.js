import {__DEV__, __STAGING__, __PROD__, __TESTING__} from "@const"

const mock = 'https://959a32bb-ace7-40c8-8f63-90feeeb5b39e.mock.pstmn.io'
const prod = 'https://common-api.unicloud360.com'
const dev = 'https://common-dev-api.unicloud360.com'

// types -> dev, testing, staging

const conf = {
    serverUrl: __PROD__ ? prod : dev,
    basePath: `api`,
    version: `v1/`,
    type: __PROD__ ? 'amrac' : 'amrac'
}

export default conf
