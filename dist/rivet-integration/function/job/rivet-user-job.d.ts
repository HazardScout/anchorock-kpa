import { JobStatus } from "../../../base-integration/src/job";
import { IJob } from "../../../base-integration/src/job/job-interface";
export declare class RivetUserJob implements IJob {
    name: string;
    kpaSite: string;
    kpaToken: string;
    clientId: string;
    token: string;
    isEditUser: boolean;
    config: any;
    defaultRole: string;
    welcomeEmail: boolean;
    resetPassword: boolean;
    constructor(config: any);
    execute(status: JobStatus): Promise<void>;
}
