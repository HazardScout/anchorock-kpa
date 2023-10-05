import timers from 'timers/promises';
import { IWorker } from 'worker/workers';
import WorkerStatus from 'worker/shared/worker-status';

export default async (worker:IWorker):Promise<WorkerStatus> => {
  const status = new WorkerStatus(worker.name);

  try {
    status.start();
    await Promise.race([
      worker.execute(status),
      watchForTimeout(status, worker.maxtime_milli),
    ]);
  } catch (error) {
    status.error = error;
  } finally {
    status.done();
  }

  return status;
};

const watchForTimeout = async (status:WorkerStatus, timeout_milli = (1000 * 60 * 5)) => {
  await timers.setTimeout(timeout_milli);
  status.log('timeout');
  throw new Error('timeout');
};
