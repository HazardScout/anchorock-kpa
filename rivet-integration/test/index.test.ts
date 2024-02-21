import { readFileSync } from "fs";
import { rivetWorkerLambdaHandler } from "../function/rivet-worker";
import { rivetUserLambdaHandler } from "../function/rivet-user-worker";
import { rivetProjectLambdaHandler } from "../function/rivet-project-worker";


require('dotenv').config();

describe('running-test', () => {

  describe('lambda', () => {
    const event: any = { headers: {}};
    const context: any = { functionVersion: '$LATEST' };
    const callback: any = {};

    it('worker-handler', async () => {
      const event = {}
      const result: any = await rivetWorkerLambdaHandler(event, context, callback);
      expect(result.statusCode).toBe(200);
    }, 300000)

    it('user-handler', async () => {
      let eventFile = readFileSync('event-user.json','utf8')
      let event = JSON.parse(eventFile)
      const result: any = await rivetUserLambdaHandler(event, context, callback);
      expect(result.statusCode).toBe(200);
    }, 300000)


    it('project-handler', async () => {
      let eventFile = readFileSync('event-project.json','utf8')
      let event = JSON.parse(eventFile)
      const result: any = await rivetProjectLambdaHandler(event, context, callback);
      expect(result.statusCode).toBe(200);
    }, 300000)

  })
})