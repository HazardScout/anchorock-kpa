import { JobStatus } from "./job-status";
export interface IJob {
    name: string;
    execute: (status: JobStatus) => Promise<void>;
}
