import { IWorker } from "../shared/worker-interface";
import WorkerStatus from "../shared/worker-status";
import { ProjectJob, UserJob } from "./procore/job";


export class ProcoreWorker implements IWorker {
    name: string;
    execute: (status: WorkerStatus) => Promise<void>;

    constructor() {
        this.name = 'Procore Worker';
        this.execute = async (status:WorkerStatus) => {
            status.log('Worker Procore Start...');

            //Fetch Configuration

            //Run User Job
            let companyName = '';
            let kpaToken = '';
            let userJob = new UserJob(companyName, kpaToken);
            await userJob.execute();

            //Run Project Job
            let projectJob = new ProjectJob(companyName, kpaToken);
            await projectJob.execute();

            status.log('Worker Procore Done...');
        };
    }
}

export default new ProcoreWorker();