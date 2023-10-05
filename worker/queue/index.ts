import timers from 'timers/promises';
import workers from 'worker/workers';
import runWorker from './run-worker';

/*
  Workers can be queued or managed from here:
    Run workers based on CRON timer?
    Run workers through lambdas?
*/

// for debugging
export const runAllWorkers = async () => {
  for (const worker of workers) {
    console.log(worker.name);
    const status = await runWorker(worker);
    console.log(status);
    await timers.setImmediate(0);
  }
};

export { runCronWorkers } from './start-cron-workers';
