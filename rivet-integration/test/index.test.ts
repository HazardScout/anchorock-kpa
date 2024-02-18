import { lambdaHandler } from "../function"


require('dotenv').config();

describe('Test A', () => {

  describe('Lamda Handler', () => {
    const event: any = { headers: {}};
    const context: any = { functionVersion: '$LATEST' };
    const callback: any = {};

    it('Trigger Handler', async () => {
      const event = {}
      const result: any = await lambdaHandler(event, context, callback);
      expect(result.statusCode).toBe(200);
    }, 300000)
  })
})