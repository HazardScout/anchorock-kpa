import { IJob } from "../../../base-integration/src/job/job-interface";
import { JobStatus } from "../../../base-integration/src/job";
export declare class RivetProjectJob implements IJob {
    name: string;
    kpaSite: string;
    kpaToken: string;
    clientId: string;
    token: string;
    isEditProject: boolean;
    config: any;
    constructor(config: any);
    execute(status: JobStatus): Promise<void>;
}
