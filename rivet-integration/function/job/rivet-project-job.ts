import { KPAProjectAPI } from "../base-integration/api";
import { RivetAPI } from "../api";
import { KPARivetConfigurationModel } from "../model";
import { KPAProjectModel } from "../base-integration/model";
import { IJob } from "../base-integration/job/job-interface";
import { JobStatus } from "../base-integration/job";

export class RivetProjectJob implements IJob {
    name: string;
    config: KPARivetConfigurationModel;

    constructor(config: KPARivetConfigurationModel) {
        this.name = 'Rivet Project Job';
        this.config = config;
    }

    async execute(status:JobStatus): Promise<void> {
        console.log("Execute RivetProjectJob Start");
        try {

            let kpaProjectAPI = new KPAProjectAPI(this.config.kpaToken);
            let kpaExistProjects = await kpaProjectAPI.getAllProject();
            status.totalExistingRecord = kpaExistProjects.length
            console.log(kpaExistProjects)

            let rivetAPI = new RivetAPI(this.config.clientId, this.config.token);
            let projects = await rivetAPI.getProjects();
            status.totalSourceRecord = projects.length

            let kpaProjects: KPAProjectModel[] = [];
            for(let project of projects) {
                if (project.jobName.startsWith('*') === true) {
                    status.skippedRecord++
                    continue
                }

                if (project.jobNumber === null || project.jobNumber === '') {
                    status.skippedRecord++
                    continue
                }

                var kpaProject : KPAProjectModel | null = null;
                for (let i = 0; i < kpaExistProjects.length; i++) {
                    const kpaExistProject = kpaExistProjects[i];
                    if (kpaExistProject.name === project.jobName && kpaExistProject.code === project.jobNumber) {
                        kpaProject = kpaExistProject;
                        kpaExistProjects.splice(i,1);
                        break;
                    }
                }

                if (kpaProject == null) {
                    kpaProject = new KPAProjectModel();
                } else {
                    if (!this.config.isEditProject) {
                        // console.log(`Skip Project because of Cannot Allow to edit ${project.jobName}`)
                        status.skippedRecord++
                        continue;
                    }
                }

                //Build KPA project Data and Check existing
                kpaProject.name = project.jobName;
                kpaProject.code = project.jobNumber;
                
                kpaProjects.push(kpaProject);
                status.upsertRecord++
            }

            //Send Data
            console.log(kpaProjects.length)
            // const success = await kpaProjectAPI.saveProject(this.config.kpaSite, this.config.emailReport, kpaProjects)
            // if (!success) {
            //     console.log('Failed to save Project')
            // }
        } catch(e) {
            console.log(`Worker Stop with Error : ${e}`)
            //Send an email to failed;
        }

        console.log("Execute RivetProjectJob Done");
    }

}