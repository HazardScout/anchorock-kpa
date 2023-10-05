import WorkerStatus from './worker-status';

export interface IWorker {
  name:string,
  execute:(status:WorkerStatus) => Promise<void>,
  // default set in run-worker.watchForTimeout
  maxtime_milli?:number,
  // https://crontab.cronhub.io
  cron?:string,
}
