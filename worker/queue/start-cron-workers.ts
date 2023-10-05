import { CronJob } from 'cron';
import workers from 'worker/workers';
import runWorker from './run-worker';

export const runCronWorkers = async ():Promise<void> => {
  const workersMissingCron:string[] = [];
  const cronWorkers = workers.filter(worker => {
    if (!worker.cron) {
      workersMissingCron.push(worker.name);
    }
    return worker.cron;
  });

  if (!cronWorkers.length) {
    console.warn('no workers have a cron schedule');
    return;
  }

  if (workersMissingCron.length) {
    console.warn('some workers do not have a cron schedule:', workersMissingCron.join());
  }

  const activeCronJobs = cronWorkers.map(worker => {
    return new CronJob(worker.cron, async () => {
      const status = await runWorker(worker);
      console.log(status);
    }, null, true, 'America/Chicago');
  });

  console.log('activeCronJobs.length :>> ', activeCronJobs.length, cronWorkers.map(w => w.name).join());
};

export default runCronWorkers;
