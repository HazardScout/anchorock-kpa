export class WorkerStatus {
  workerName:string;
  duration:number;
  private started:number;
  private stopped:number;
  logs:LogType[];
  error:Error|string;

  constructor(workerName:string) {
    this.workerName = workerName;
    this.logs = [];
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
  log(message:string) {
    this.logs.push({
      message,
      timestamp: Date.now(),
    });
  }
  toJSON() {
    return {
      ...this,

      // the Error type does not natively work with JSON.stringify
      // this should only matter if we store or transmit the JSON
      error: this.error ? String(this.error) : undefined,
    };
  }
}

export default WorkerStatus;

export type LogType = {
  message:string,
  timestamp:number,
};
