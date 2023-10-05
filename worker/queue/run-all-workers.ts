import timers from 'timers/promises';
import workers from 'worker/workers';
import runWorker from './run-worker';

/** run all workers serially */
export default async ():Promise<void> => {
  for (const worker of workers) {
    const status = await runWorker(worker);
    console.log(status);

    await timers.setImmediate(0);
  }

  console.log(`
###
Done.
  `);
};
