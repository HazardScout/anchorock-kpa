import { KPAUserAPI } from "../../../shared/api";
import { IJob } from "../../../shared/job-interface";
import { KPAUserModel } from "../../../shared/model";
import { ProcoreAPI } from "../api";
import { ProcoreAuthModel } from "../model";

export class UserJob implements IJob {
    name: string;
    companyName: string;
    kpaToken: string;

    constructor(companyName: string, kpaToken: string) {
        this.name = "Procore User Job";
        this.companyName = companyName;
        this.kpaToken = kpaToken;
    }

    async execute(): Promise<void> {
        try {
            //Get All KPA Users
            let kpaUserAPI = new KPAUserAPI(this.kpaToken);

            //Fetch Procore Company
            let auth = new ProcoreAuthModel('','');
            let procoreAPI = new ProcoreAPI(auth, async (newAuth) => {
                console.log('Resave AT: '+newAuth.accessToken)
                console.log('Resave RT: '+newAuth.refreshToken)
            })
            let companies = await procoreAPI.getCompanies();
            for(let company of companies) {
                if (this.companyName === '' || this.companyName === company.name) {
                    let users = await procoreAPI.getUsers(company.id);

                    for(let user of users) {
                        //Build KPA user Data and Check existing
                        let kpaUser = new KPAUserModel();
                        
                        //Set kpaUserData

                        //Save / Update User
                        kpaUserAPI.saveUser(kpaUser)
                    }
                }
            }
        } catch(e) {
            console.log('Worker Stop with Error : '+e.message)
        }
    }
    
}