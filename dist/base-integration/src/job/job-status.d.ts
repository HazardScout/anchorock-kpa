export declare class JobStatus {
    jobName: string;
    duration: number;
    private started;
    private stopped;
    totalExistingRecord: number;
    totalSourceRecord: number;
    upsertRecord: number;
    inactivatedRecord: number;
    skippedRecord: number;
    error: ErrorLike | string;
    constructor(jobName: string);
    start(): void;
    done(): void;
}
export type ErrorLike = {
    message: string;
    stack?: string;
};
