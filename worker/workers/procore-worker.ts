import { IWorker } from "../shared/worker-interface";
import WorkerStatus from "../shared/worker-status";
import { ProjectJob, UserJob } from "./procore/job";
import { KPAProcoreConfigurationDB } from "../shared/mongodb";


export class ProcoreWorker implements IWorker {
    name: string;
    cron?: string;
    maxtime_milli?: number;
    execute: (status: WorkerStatus) => Promise<void>;

    constructor() {
        this.name = 'Procore Worker';

        // every hour
        this.cron = '0 * * * *';
        // 30 minutes
        this.maxtime_milli = .5 * (1000 * 60 * 60);

        this.execute = async (status:WorkerStatus) => {
            status.log('Worker Procore Start...');

            //Fetch Configuration
            const procoreConfigDB = new KPAProcoreConfigurationDB();
            let configs = await procoreConfigDB.getConfiguration();
            for(var config of configs) {
                status.log(`Execute Procore Customer: ${config.customerId} : ${config.procoreCompanyName}`);

                if (config.kpaToken == '' || config.procoreToken == '' || config.procoreRefreshToken == '') {
                    status.log(`Skip Procore Customer: ${config.customerId} : ${config.procoreCompanyName}`);
                    continue;
                }

                if (config.isSyncUser) {
                    status.log(`Start Sync User`);
                    let userJob = new UserJob(config);
                    await userJob.execute();
                    status.log(`Done Sync User`);
                }

                if (config.isSyncProject) {
                    status.log(`Start Sync Project`);
                    let projectJob = new ProjectJob(config);
                    await projectJob.execute();
                    status.log(`Done Sync Project`);
                }

                status.log(`Done Procore Customer: ${config.customerId} : ${config.procoreCompanyName}`);
            }

            status.log('Worker Procore Done...');
        };
    }
}

export default new ProcoreWorker();
