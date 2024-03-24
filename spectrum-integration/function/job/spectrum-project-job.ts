import { IJob, JobStatus } from "../../../base-integration/src/job";
import { KPAProjectAPI } from "../../../base-integration/src/api";
import { SpectrumAPI } from "../api";
import { KPAProjectModel } from "../../../base-integration/src/model";

export class SpectrumProjectJob implements IJob {
    name: string;
    kpaSite: string;
    kpaToken: string;
    serverUrl: string;
    companyCode: string;
    authorizationId: string;
    isEditProject: boolean;
    config: any;

    constructor(config: any) {
        this.name = 'Spectrum Project Job';
        this.config = config;

        this.kpaSite = config["kpaSite"]["stringValue"];
        this.kpaToken = config["kpaToken"]["stringValue"];
        this.serverUrl = config["serverUrl"]["stringValue"];
        this.companyCode = config["companyCode"]["stringValue"];
        this.authorizationId = config["authorizationId"]["stringValue"];
        this.isEditProject = config["isEditProject"]["stringValue"] == '1';
    }

    async execute(status: JobStatus): Promise<void> {
        console.log("Execute SpectrumProjectJob Start");
        try {
            //Fetch KPA Projects
            let kpaProjectAPI = new KPAProjectAPI(this.kpaToken);
            // let kpaExistProjects = await kpaProjectAPI.getAllProject();
            let kpaExistProjects : KPAProjectModel[] = [];
            status.totalExistingRecord = kpaExistProjects.length

            //Fetch Spectrum Projects
            let spectrumAPI = new SpectrumAPI(this.serverUrl, this.authorizationId, this.companyCode)
            let projects = await spectrumAPI.getProjects();
            status.totalSourceRecord = projects.length

            //Loop Spectrum Projects
            let kpaProjects: KPAProjectModel[] = [];
            for(let project of projects) {

                var kpaProject : KPAProjectModel | null = null;
                for (let i = 0; i < kpaExistProjects.length; i++) {
                    const kpaExistProject = kpaExistProjects[i];
                    if (kpaExistProject.code === project.jobNumber) {
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
                
                //Build KPA project Data and Check existing
                kpaProject.name = project.jobDescription;
                kpaProject.code = project.jobNumber;
                kpaProject.isActive = project.statusCode === "A"
                kpaProject.address = project.address;
                kpaProject.city = project.city;
                kpaProject.state = project.state;
                kpaProject.zip = project.zipCode;

                //Add Projects To List
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
        }
        console.log("Execute SpectrumProjectJob Done");
    }

}