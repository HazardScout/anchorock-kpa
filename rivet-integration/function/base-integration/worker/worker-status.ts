import { JobStatus } from "../job";

export class WorkerStatus {
    workerName:string;
    duration:number;
    private started:number;
    private stopped:number;
    jobLog:JobStatus[];
    error:string;
  
    constructor(workerName:string) {
      this.workerName = workerName;
      this.jobLog = [];
    }

    start() {
      this.started = Date.now();
    }

    done() {
      if (this.stopped) {
        return;
      }
  
      this.stopped = Date.now();
      this.duration = this.stopped - this.started;
    }
}
  
export default WorkerStatus;
  