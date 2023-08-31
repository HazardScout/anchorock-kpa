import { KPAUserAPI } from "../../../shared/api";
import { IJob } from "../../../shared/job-interface";
import { KPAProcoreConfigurationModel, KPAUserModel } from "../../../shared/model";
import { KPAProcoreConfigurationDB } from "../../../shared/mongodb";
import { ProcoreAPI } from "../api";
import { ProcoreAuthModel } from "../model";

export class UserJob implements IJob {
    name: string;
    config: KPAProcoreConfigurationModel;

    constructor(config: KPAProcoreConfigurationModel) {
        this.name = "Procore User Job";
        this.config = config;
    }

    async execute(): Promise<void> {
        try {
            //Get All KPA Users
            let kpaUserAPI = new KPAUserAPI(this.config.kpaToken);

            //Fetch Procore Company
            let auth = new ProcoreAuthModel(this.config.procoreToken, this.config.procoreRefreshToken);
            let procoreAPI = new ProcoreAPI(auth, async (newAuth) => {
                this.config.procoreToken = newAuth.accessToken;
                this.config.procoreRefreshToken = newAuth.refreshToken;

                let db = new KPAProcoreConfigurationDB();
                db.updateConfiguration(this.config);
            })
            let companies = await procoreAPI.getCompanies();
            for(let company of companies) {
                if (this.config.procoreCompanyName === '' || this.config.procoreCompanyName === company.name) {
                    let users = await procoreAPI.getUsers(company.id);

                    let kpaUsers : KPAUserModel[] = [];
                    for(let user of users) {
                        //Build KPA user Data and Check existing
                        let kpaUser = new KPAUserModel();

                        if (user.employee_id == null || user.employee_id == '') {
                            continue;
                        }

                        kpaUser.employeeNumber = user.employee_id;
                        kpaUser.firstName = user.first_name
                        kpaUser.lastName = user.last_name;
                        kpaUser.username = user.employee_id;
                        kpaUser.email = user.email_address;
                        kpaUser.initialPassword = user.employee_id;
                        kpaUser.role = 'Employee';
                        kpaUser.title = user.job_title;

                        kpaUsers.push(kpaUser);
                    }
                    
                    //Send Data
                    await kpaUserAPI.saveUser(this.config.kpaSite, this.config.emailReport, kpaUsers)
                }
            }
        } catch(e) {
            console.log('Worker Stop with Error : '+e.message)
            //Send an email to failed;
        }
    }
    
}