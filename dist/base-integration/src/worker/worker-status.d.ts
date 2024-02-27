import { JobStatus } from "../job";
export declare class WorkerStatus {
    workerName: string;
    duration: number;
    private started;
    private stopped;
    jobLog: JobStatus[];
    error: string;
    constructor(workerName: string);
    start(): void;
    done(): void;
}
export default WorkerStatus;
