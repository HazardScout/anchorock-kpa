import timers from 'timers/promises';
import WorkerStatus from 'worker/shared/worker-status';
import PublicApi from 'shared-helpers/api/public-api-sample';
import { IWorker } from '../shared/worker-interface';

export class SampleWorker implements IWorker {
  name: string;
  execute: (status: WorkerStatus) => Promise<void>;

  constructor() {
    this.name = 'Sample Worker';
    this.execute = async (status:WorkerStatus) => {
      status.log('working...');
      const publicApi = new PublicApi();

      await timers.setImmediate(500);
      const entries = await publicApi.fetchNoAuthEntries();

      status.log(`found: ${entries.length}`);
    };
  }
}

export default new SampleWorker();
