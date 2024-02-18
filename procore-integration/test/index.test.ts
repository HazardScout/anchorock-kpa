import { lambdaHandler } from "../function"
import { readFileSync } from "fs";
import { executionLambdaHandler } from "../function/procore-execution-worker";
import { extractionLambdaHandler } from "../function/procore-extraction-worker";

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