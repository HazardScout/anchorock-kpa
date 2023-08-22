import { KPAProjectAPI } from "../../../shared/api";
import { IJob } from "../../../shared/job-interface";
import { KPAProjectModel } from "../../../shared/model";
import { ProcoreAPI } from "../api";
import { ProcoreAuthModel } from "../model";

export class ProjectJob implements IJob  {
    name: string;
    companyName: string;
    kpaToken: string;

    constructor(companyName: string, kpaToken: string) {
        this.name = "Procore Project Job";
        this.companyName = companyName;
        this.kpaToken = kpaToken;
    }

    async execute(): Promise<void> {
        try {
            //Get All KPA Projects
            let kpaProjectAPI = new KPAProjectAPI(this.kpaToken);

            let auth = new ProcoreAuthModel('','');
            let procoreAPI = new ProcoreAPI(auth, async (newAuth) => {
                console.log('Resave AT: '+newAuth.accessToken)
                console.log('Resave RT: '+newAuth.refreshToken)
            })
            let companies = await procoreAPI.getCompanies();
            for(let company of companies) {
                if (this.companyName === '' || this.companyName === company.name) {
                    let projects = await procoreAPI.getProjects(company.id);

                    for(let project of projects) {
                        //Build KPA project Data and Check existing
                        let kpaProject = new KPAProjectModel();
                        
                        //Set kpaProject data

                        //Save / Update User
                        kpaProjectAPI.saveProject(kpaProject)
                    }
                }
            }
        } catch(e) {
            console.log('Worker Stop with Error : '+e.message)
        }

        throw new Error("Method not implemented.");
    }
    
}