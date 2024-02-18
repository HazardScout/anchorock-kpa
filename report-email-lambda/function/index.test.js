const index = require('./index')
const fs = require('fs')
const assert = require('assert');
const AWSXRay = require('aws-xray-sdk-core')
AWSXRay.setContextMissingStrategy('LOG_ERROR')

require('dotenv').config();

test('Runs function handler', async () => {
  let eventFile = fs.readFileSync('event.json')
  let event = JSON.parse(eventFile)
  let response = await index.handler(event, null)
  assert.equal(response.statusCode, 200);
}, 30000)