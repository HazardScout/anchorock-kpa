import { WorkerStatus } from "./worker-status";

export interface IWorker {
  name:string,
  skip:boolean,
  execute:(status:WorkerStatus) => Promise<void>,
}
