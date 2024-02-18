import { stat } from "fs";
import { IWorker } from "../../../base-integration/src/worker/worker-interface";
import WorkerStatus from "../../../base-integration/src/worker/worker-status";
import { KPARivetConfigurationDB } from "../mongodb";
import { RivetProjectJob, RivetUserJob } from "../job";
import { JobStatus } from "../../../base-integration/src/job";

export class RivetWorker implements IWorker {
    name: string;
    skip: boolean;
    execute: (status: WorkerStatus) => Promise<void>;
    
    constructor() {
        this.name = 'Rivet Worker';
        this.skip = false;
        this.execute = async (status:WorkerStatus) => {
            console.log('Worker Rivet Start');

            //Fetch Configuration
            const configDB = new KPARivetConfigurationDB();
            let configs = await configDB.getConfiguration();
            for(var config of configs) {
                console.log(`Execute Rivet Customer: ${config.kpaSite} ${config.clientId} ${config.token} Start`);

                if (config.isSyncUser) {
                    console.log(`Start Sync User`);
                    let userJob = new RivetUserJob(config);
                    let jobStatus = new JobStatus(userJob.name);
                    status.jobLog.push(jobStatus);
                    
                    try {
                        jobStatus.start()
                        await userJob.execute(jobStatus);
                    } catch (e) {
                        jobStatus.error = String(e)
                    } finally {
                        jobStatus.done()
                    }
                    console.log(`Done Sync User`);
                }

                if (config.isSyncProject) {
                    console.log(`Start Sync Project`);
                    let projectJob = new RivetProjectJob(config);
                    let jobStatus = new JobStatus(projectJob.name);
                    status.jobLog.push(jobStatus);

                    try {
                        jobStatus.start()
                        await projectJob.execute(jobStatus);
                    } catch (e) {
                        jobStatus.error = String(e)
                    } finally {
                        jobStatus.done()
                    }
                    console.log(`Done Sync Project`);
                }

                console.log(`Execute Rivet Customer: ${config.kpaSite} Done`);
            }

            console.log('Worker Rivet End');
        }
    }
}

export default new RivetWorker();