import { IJob, JobStatus } from "../../../base-integration/src/job";
import { KPAProjectAPI } from "../../../base-integration/src/api";
import { SpectrumAPI } from "../api";
import { KPAProjectModel } from "../../../base-integration/src/model";

export class SpectrumProjectJob implements IJob {
    name: string;
    kpaSite: string;
    kpaToken: string;
    clientId: string;
    clientSecret: string;
    isEditProject: boolean;
    emailReport: string[];
    config: Map<String,Map<String, String>>;

    constructor(config: Map<String,Map<String, String>>) {
        this.name = 'Spectrum Project Job';
        this.config = config;

        this.kpaSite = `${config.get('kpaSite')?.get('stringValue')}`;
        this.kpaToken = `${config.get('kpaToken')?.get('stringValue')}`;
        this.clientId = `${config.get('clientId')?.get('stringValue')}`;
        this.clientSecret = `${config.get('clientSecret')?.get('stringValue')}`;
        this.isEditProject = `${config.get('isEditProject')?.get('stringValue')}` == '1';

        const emailReportString = `${config.get('emailReport')?.get('stringValue')}`;
        this.emailReport = JSON.parse(emailReportString);
    }

    async execute(status: JobStatus): Promise<void> {
        console.log("Execute SpectrumProjectJob Start");
        try {
            //Fetch KPA Projects
            let kpaProjectAPI = new KPAProjectAPI(this.kpaToken);
            let kpaExistProjects = await kpaProjectAPI.getAllProject();
            status.totalExistingRecord = kpaExistProjects.length

            //Fetch Spectrum Projects
            let spectrumAPI = new SpectrumAPI(this.clientId, this.clientSecret)
            let projects = await spectrumAPI.getProjects();
            status.totalSourceRecord = projects.length

            //Loop Spectrum Projects
            let kpaProjects: KPAProjectModel[] = [];
            for(let project of projects) {
                //Ignore Project without job number
                if (project.jobNumber === null || project.jobNumber === '') {
                    status.skippedRecord++
                    continue
                }

                var kpaProject : KPAProjectModel | null = null;
                for (let i = 0; i < kpaExistProjects.length; i++) {
                    const kpaExistProject = kpaExistProjects[i];
                    if (kpaExistProject.name === project.jobDescription && kpaExistProject.code === project.jobNumber) {
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

                //Add Projects To List
                kpaProjects.push(kpaProject);
                status.upsertRecord++
            }
            //Send Data
            console.log(kpaProjects.length)
            // const success = await kpaProjectAPI.saveProject(this.kpaSite, this.emailReport, kpaProjects)
            // if (!success) {
            //     console.log('Failed to save Project')
            // }
        } catch(e) {
            console.log(`Worker Stop with Error : ${e}`)
        }
        console.log("Execute SpectrumProjectJob Done");
    }

}