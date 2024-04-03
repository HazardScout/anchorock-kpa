import { KPAProjectAPI } from "../../../base-integration/src/api";
import { RivetAPI } from "../api";
import { KPARivetConfigurationModel } from "../model";
import { KPAProjectModel } from "../../../base-integration/src/model";
import { IJob } from "../../../base-integration/src/job/job-interface";
import { JobStatus } from "../../../base-integration/src/job";

export class RivetProjectJob implements IJob {
    name: string;
    kpaSite: string;
    kpaToken: string;
    clientId: string;
    token: string;
    isEditProject: boolean;
    config: any;

    constructor(config: any) {
        this.name = 'Rivet Project Job';
        this.config = config;

        this.kpaSite = config["kpaSite"]["stringValue"];
        this.kpaToken = config["kpaToken"]["stringValue"];
        this.clientId = config["clientId"]["stringValue"];
        this.token = config["token"]["stringValue"];
        this.isEditProject = config["isEditProject"]["stringValue"] == '1';
    }

    async execute(status:JobStatus): Promise<void> {
        console.log("Execute RivetProjectJob Start");
        try {

            let kpaProjectAPI = new KPAProjectAPI(this.kpaToken);
            // let kpaExistProjects = await kpaProjectAPI.getAllProject();
            let kpaExistProjects : KPAProjectModel[] = [];
            status.totalExistingRecord = kpaExistProjects.length
            console.log(kpaExistProjects)

            let rivetAPI = new RivetAPI(this.clientId, this.token);
            let projects = await rivetAPI.getProjects();
            status.totalSourceRecord = projects.length

            let kpaProjects: KPAProjectModel[] = [];
            for(let project of projects) {
                if (project.jobName.startsWith('*') === true) {
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
                    if (!this.isEditProject) {
                        // console.log(`Skip Project because of Cannot Allow to edit ${project.jobName}`)
                        status.skippedRecord++
                        continue;
                    }
                }

                if (project.jobName.includes("\"")) {
                    project.jobName = project.jobName.replace("\"", "'");
                }

                //Build KPA project Data and Check existing
                kpaProject.name = project.jobName;
                kpaProject.code = project.jobNumber;
                kpaProject.isActive = project.jobStatus === 'In-Progress'
                kpaProject.address = project.address;
                kpaProject.city = project.city;
                kpaProject.state = project.state;
                kpaProject.zip = project.zip;

                kpaProjects.push(kpaProject);
                status.upsertRecord++
            }

            //Send Data
            console.log(kpaProjects.length)
            const success = await kpaProjectAPI.saveProject(this.kpaSite, kpaProjects)
            if (!success) {
                console.log('Failed to save Project')
            }
        } catch(e) {
            console.log(`Worker Stop with Error : ${e}`)
            //Send an email to failed;
        }

        console.log("Execute RivetProjectJob Done");
    }

}