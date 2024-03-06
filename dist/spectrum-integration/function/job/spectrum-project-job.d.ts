import { IJob, JobStatus } from "../../../base-integration/src/job";
export declare class SpectrumProjectJob implements IJob {
    name: string;
    kpaSite: string;
    kpaToken: string;
    clientId: string;
    clientSecret: string;
    isEditProject: boolean;
    config: any;
    constructor(config: any);
    execute(status: JobStatus): Promise<void>;
}
