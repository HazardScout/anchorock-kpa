import WorkerStatus from './worker-status';

export interface IWorker {
  name:string,
  execute:(status:WorkerStatus) => Promise<void>,
}
