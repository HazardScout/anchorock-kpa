import { IJob } from "../../../base-integration/src/job";
import { KPAProcoreConfigurationModel } from "../model";
import { JobStatus } from "../../../base-integration/src/job";
export declare class ProcoreProjectJob implements IJob {
    name: string;
    config: KPAProcoreConfigurationModel;
    constructor(config: KPAProcoreConfigurationModel);
    execute(status: JobStatus): Promise<void>;
}
