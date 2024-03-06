import { IJob, JobStatus } from "../../../base-integration/src/job";
export declare class SpectrumUserJob implements IJob {
    name: string;
    kpaSite: string;
    kpaToken: string;
    clientId: string;
    clientSecret: string;
    isEditUser: boolean;
    config: any;
    defaultRole: string;
    welcomeEmail: boolean;
    resetPassword: boolean;
    constructor(config: any);
    execute(status: JobStatus): Promise<void>;
}
