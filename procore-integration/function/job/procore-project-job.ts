import { IJob } from "../../../base-integration/src/job";
import { KPAProjectModel } from "../../../base-integration/src/model";
import { ProcoreAPI } from "../api";
import { KPAProcoreConfigurationModel, ProcoreAuthModel } from "../model";
import { KPAProcoreConfigurationDB } from "../mongodb";
import { KPAProjectAPI } from "../../../base-integration/src/api";
import { JobStatus } from "../../../base-integration/src/job";

export class ProcoreProjectJob implements IJob  {
    name: string;
    config: KPAProcoreConfigurationModel;

    constructor(config: KPAProcoreConfigurationModel) {
        this.name = "Procore Project Job";
        this.config = config;
    }

    async execute(status: JobStatus): Promise<void> {
        try {
            //Fetch KPA Projects
            let kpaProjectAPI = new KPAProjectAPI(this.config.kpaToken);
            // let kpaExistProjects = await kpaProjectAPI.getAllProject();
            let kpaExistProjects : KPAProjectModel[] = [];
            status.totalExistingRecord = kpaExistProjects.length

            let auth = new ProcoreAuthModel(this.config.procoreToken, this.config.procoreRefreshToken);
            let procoreAPI = new ProcoreAPI(auth, async (newAuth) => {
                this.config.procoreToken = newAuth.accessToken;
                this.config.procoreRefreshToken = newAuth.refreshToken;

                let db = new KPAProcoreConfigurationDB();
                await db.updateProcoreToken(this.config);
            })
            let companies = await procoreAPI.getCompanies();
            status.totalSourceRecord = 0
            for(let company of companies) {
                for(let procoreCompany of this.config.procoreCompanies) {
                    if (procoreCompany === company.name) {
                        let projects = await procoreAPI.getProjects(company.id);
                        status.totalSourceRecord += projects.length
    
                        let kpaProjects: KPAProjectModel[] = [];
                        for(let project of projects) {
                            //Ignore Project without job number
                            if (project.project_number === null || project.project_number === '') {
                                status.skippedRecord++
                                continue
                            }

                            //Build KPA project Data and Check existing
                            var kpaProject : KPAProjectModel | null = null;
                            for (let i = 0; i < kpaExistProjects.length; i++) {
                                const kpaExistProject = kpaExistProjects[i];
                                if (kpaExistProject.name === project.name && kpaExistProject.code === project.project_number) {
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

                            kpaProject.name = project.name;
                            kpaProject.code = project.project_number;
                            if (!kpaProject.code || kpaProject.code === '') {
                                kpaProject.code = project.name;
                            }
                            kpaProject.isActive = project.active
                            kpaProject.address = project.address;
                            kpaProject.city = project.city;
                            kpaProject.state = project.state_code;
                            kpaProject.zip = project.zip;
                            
                            kpaProjects.push(kpaProject);
                            status.upsertRecord++
                        }
    
                        //Send Data
                        // console.log(kpaProjects)
                        const success = await kpaProjectAPI.saveProject(this.config.kpaSite, this.config.emailReport, kpaProjects)
                        if (!success) {
                            console.log('Failed to save Project')
                        }
                    }
                }
            }
        } catch(e) {
            console.log('Worker Stop with Error : '+String(e))
            //Send an email to failed;
        }
    }
    
}