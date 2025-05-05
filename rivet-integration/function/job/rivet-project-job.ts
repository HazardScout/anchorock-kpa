import { KPAProjectAPI } from "../../../base-integration/src/api";
import { RivetAPI } from "../api";
import { KPAProjectModel } from "../../../base-integration/src/model";
import { IJob } from "../../../base-integration/src/job/job-interface";
import { JobStatus } from "../../../base-integration/src/job";
import { debuglog } from 'util';
export class RivetProjectJob implements IJob {
    name: string;
    kpaSite: string;
    kpaToken: string;
    clientId: string;
    token: string;
    isEditProject: boolean;
    config: any;

    constructor(config: any) {
        this.config = config;

        this.kpaSite = config["kpaSite"]["stringValue"];
        this.name = 'Rivet Project Job - ' + this.kpaSite;
        this.kpaToken = config["kpaToken"]["stringValue"];
        this.clientId = config["clientId"]["stringValue"];
        this.token = config["token"]["stringValue"];
        this.isEditProject = config["isEditProject"]["stringValue"] == '1';
    }

    async execute(status:JobStatus): Promise<void> {
        debuglog('log:rivet:project')("Execute RivetProjectJob Start");
        let kpaProjectAPI = new KPAProjectAPI(this.kpaToken);
        // let kpaExistProjects = await kpaProjectAPI.getAllProject();
        let kpaExistProjects : KPAProjectModel[] = [];
        status.totalExistingRecord = kpaExistProjects.length
        debuglog('log:rivet:project')(JSON.stringify(kpaExistProjects, null, 2));

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
                if (kpaExistProject.number && kpaExistProject.name === project.jobName && kpaExistProject.number === project.jobNumber) {
                    kpaProject = kpaExistProject;
                    kpaExistProjects.splice(i,1);
                    break;
                }
            }

            if (kpaProject == null) {
                kpaProject = new KPAProjectModel();
            } else {
                if (!this.isEditProject) {
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
        debuglog('log:rivet:project')(String(kpaProjects.length))
        const success = await kpaProjectAPI.saveProject(this.kpaSite, kpaProjects);
        if (!success) {
            throw new Error('Failed to save Projects:' + this.config.kpaSite);
        }
        debuglog('log:rivet:project')("Execute RivetProjectJob Done");
    }

}
