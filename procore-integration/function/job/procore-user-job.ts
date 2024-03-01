import { KPAUserAPI } from "../../../base-integration/src/api";
import { IJob } from "../../../base-integration/src/job";
import { KPAUserModel } from "../../../base-integration/src/model";
import { ProcoreAPI } from "../api";
import { KPAProcoreConfigurationModel, procoreContext } from "../model";
import { KPAProcoreConfigurationDB } from "../mongodb";
import { JobStatus } from "../../../base-integration/src/job";

export class ProcoreUserJob implements IJob {
    name: string;
    config: KPAProcoreConfigurationModel;

    constructor(config: KPAProcoreConfigurationModel) {
        this.name = "Procore User Job";
        this.config = config;
    }

    async execute(status: JobStatus): Promise<void> {
        try {
            //Fetch KPA Users
            let kpaUserAPI = new KPAUserAPI(this.config.kpaToken);
            let kpaExistUsers = await kpaUserAPI.getAllUser();
            status.totalExistingRecord = kpaExistUsers.length;
            console.log(kpaExistUsers)

            //Fetch Procore Company
            let auth = new procoreContext(this.config.procoreToken, this.config.procoreRefreshToken);
            let procoreAPI = new ProcoreAPI(auth, async (newAuth) => {
                this.config.procoreToken = newAuth.accessToken;
                this.config.procoreRefreshToken = newAuth.refreshToken;

                let db = new KPAProcoreConfigurationDB();
                db.updateProcoreToken(this.config);
            })
            let companies = await procoreAPI.getCompanies();
            status.totalSourceRecord = 0

            for(let company of companies) {
                for(let procoreCompanyId of this.config.procoreCompanyIds) {
                    if (procoreCompanyId === company.id) {
                        let users = await procoreAPI.getUsers(company.id);
                        status.totalSourceRecord += users.length

                        let kpaUsers : KPAUserModel[] = [];
                        for(let user of users) {
                            if (user.employee_id == null || user.employee_id == '') {
                                status.skippedRecord++
                                continue;
                            }

                            if (user.email_address == null || user.email_address == '') {
                                status.skippedRecord++
                                continue;
                            }

                            //Build KPA user Data and Check existing
                            var kpaUser : KPAUserModel | null = null;
                            for (let i = 0; i < kpaExistUsers.length; i++) {
                                const kpaExistUser = kpaExistUsers[i];

                                //Compare KPA Username with Procore user email
                                if (kpaExistUser.username === user.email_address) {
                                    kpaUser = kpaExistUser;
                                    kpaExistUsers.splice(i,1);
                                    break;
                                }
                            }

                            //Build KPA user Data and Check existing
                            if (kpaUser == null) {
                                kpaUser = new KPAUserModel();
                                if (!user.is_active) {
                                    // console.log(`Skip User because of Termination Date ${user.email_address} ${user.terminationDate}`)
                                    status.skippedRecord++
                                    continue;
                                }
                            } else {
                                if (!this.config.isEditUser) {
                                    // console.log(`Skip User because of Cannot Allow to edit ${user.email_address}`)
                                    status.skippedRecord++
                                    continue;
                                }

                                if (!user.is_active) {
                                    status.inactivatedRecord++
                                }
                            }

                            kpaUser.employeeNumber = user.employee_id;
                            kpaUser.firstName = user.first_name
                            kpaUser.lastName = user.last_name;
                            kpaUser.email = user.email_address;
                            kpaUser.username = user.email_address;
                            kpaUser.initialPassword = `KPAFlex2024!!`;
                            kpaUser.role = this.config.defaultRole;
                            kpaUser.title = user.job_title;
                            kpaUser.welcomeEmail = this.config.isWelcomeEmail
                            kpaUser.resetPassword = this.config.isForceResetPassword

                            if (!user.is_active && kpaUser.terminationDate == null) {
                                kpaUser.terminationDate = new Date().toDateString();
                            }

                            kpaUsers.push(kpaUser);
                            status.upsertRecord++;
                        }

                        //Send Data
                        // console.log(kpaUsers)
                        const success = await kpaUserAPI.saveUser(this.config.kpaSite, kpaUsers)
                        if (!success) {
                            console.log('Failed to save Users')
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
