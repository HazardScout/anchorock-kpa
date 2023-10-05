import { KPAProjectAPI } from "../../../shared/api";
import { IJob } from "../../../shared/job-interface";
import { KPAProcoreConfigurationModel, KPAProjectModel } from "../../../shared/model";
import { KPAProcoreConfigurationDB } from "../../../shared/mongodb";
import { ProcoreAPI } from "../api";
import { ProcoreAuthModel } from "../model";

export class ProjectJob implements IJob  {
    name: string;
    config: KPAProcoreConfigurationModel;
    kpaToken: string;

    constructor(config: KPAProcoreConfigurationModel) {
        this.name = "Procore Project Job";
        this.config = config;
    }

    async execute(): Promise<void> {
        try {
            //Get All KPA Projects
            let kpaProjectAPI = new KPAProjectAPI(this.config.kpaToken);

            let auth = new ProcoreAuthModel(this.config.procoreToken, this.config.procoreRefreshToken);
            let procoreAPI = new ProcoreAPI(auth, async (newAuth) => {
                this.config.procoreToken = newAuth.accessToken;
                this.config.procoreRefreshToken = newAuth.refreshToken;

                let db = new KPAProcoreConfigurationDB();
                await db.updateConfiguration(this.config);
            })
            let companies = await procoreAPI.getCompanies();
            for(let company of companies) {
                if (this.config.procoreCompanyName === '' || this.config.procoreCompanyName === company.name) {
                    let projects = await procoreAPI.getProjects(company.id);

                    let kpaProjects: KPAProjectModel[] = [];
                    for(let project of projects) {
                        //Build KPA project Data and Check existing
                        let kpaProject = new KPAProjectModel();
                        kpaProject.name = project.name;
                        kpaProject.code = project.project_number;

                        kpaProjects.push(kpaProject);
                    }

                    //Send Data
                    await kpaProjectAPI.saveProject(this.config.kpaSite, this.config.emailReport, kpaProjects)
                }
            }
        } catch(e) {
            console.log('Worker Stop with Error : '+e.message)
            //Send an email to failed;
        }

        throw new Error("Method not implemented.");
    }

}
