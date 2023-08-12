import { IWorker } from 'worker/workers';
import WorkerStatus from 'worker/shared/worker-status';

export default async (worker:IWorker):Promise<WorkerStatus> => {
  const status = new WorkerStatus(worker.name);

  try {
    status.start();
    await worker.execute(status);
  } catch (error) {
    status.error = error;
  } finally {
    status.done();
  }

  return status;
};
