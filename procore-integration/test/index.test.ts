import { readFileSync } from "fs";
import { executionLambdaHandler } from "procore/function/procore-execution-worker";
import { extractionLambdaHandler } from "procore/function/procore-extraction-worker";
import {
  describe,
  it,
  expect,
} from '@jest/globals';

require('dotenv').config();

describe('running-test', () => {

  describe('lambda', () => {
    const event: any = { headers: {}};
    const context: any = { functionVersion: '$LATEST' };
    const callback: any = {};

    it('extraction-handler', async () => {
      const event = {}
      const result: any = await extractionLambdaHandler(event, context, callback);
      expect(result.statusCode).toBe(200);
    }, 300000)

    it('execution-handler', async () => {
      let eventFile = readFileSync('event-execution.json','utf8')
      let event = JSON.parse(eventFile)
      const result: any = await executionLambdaHandler(event, context, callback);
      expect(result.statusCode).toBe(200);
    }, 300000)

  })
})
