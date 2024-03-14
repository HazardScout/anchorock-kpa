export class JobStatus {
    jobName:string;
    duration:number;
    private started:number;
    private stopped:number;
    totalExistingRecord:number;
    totalSourceRecord:number;
    upsertRecord:number;
    inactivatedRecord:number;
    skippedRecord:number;
    error:ErrorLike|string;

    constructor(jobName:string) {
      this.jobName = jobName;
      this.totalExistingRecord = 0;
      this.totalSourceRecord = 0;
      this.upsertRecord = 0;
      this.inactivatedRecord = 0;
      this.skippedRecord = 0;
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

export type ErrorLike = {
  message: string,
  stack?: string,
}