import { readFileSync } from "fs";
import { workerLambdaHandler } from "../function/spectrum-worker";
import { spectrumUserLambdaHandler } from "../function/spectrum-user-worker";
import { spectrumProjectLambdaHandler } from "../function/spectrum-project-worker";


require('dotenv').config();

describe('running-test', () => {

  describe('lambda', () => {
    const event: any = { headers: {}};
    const context: any = { functionVersion: '$LATEST' };
    const callback: any = {};

    it('worker-handler', async () => {
      const event = {}
      const result: any = await workerLambdaHandler(event, context, callback);
      expect(result.statusCode).toBe(200);
    }, 300000)

    it('user-handler', async () => {
      let eventFile = readFileSync('event-user.json','utf8')
      let event = JSON.parse(eventFile)
      const result: any = await spectrumUserLambdaHandler(event, context, callback);
      expect(result.statusCode).toBe(200);
    }, 300000)


    it('project-handler', async () => {
      let eventFile = readFileSync('event-project.json','utf8')
      let event = JSON.parse(eventFile)
      const result: any = await spectrumProjectLambdaHandler(event, context, callback);
      expect(result.statusCode).toBe(200);
    }, 300000)

  })
})