import { RivetAPI } from "../api";
import { KPAUserAPI } from "../base-integration/api";
import { JobStatus } from "../base-integration/job";
import { IJob } from "../base-integration/job/job-interface";
import { KPAUserModel } from "../base-integration/model";
import { KPARivetConfigurationModel } from "../model";

export class RivetUserJob implements IJob {
    name: string;
    config: KPARivetConfigurationModel;

    constructor(config: KPARivetConfigurationModel) {
        this.name = 'Rivet User Job';
        this.config = config;
    }

    async execute(status:JobStatus): Promise<void> {
        console.log("Execute RivetUserJob Start");
        try {

            let kpaUserAPI = new KPAUserAPI(this.config.kpaToken);
            let kpaExistUsers = await kpaUserAPI.getAllUser();
            status.totalExistingRecord = kpaExistUsers.length;
            console.log(kpaExistUsers)

            let rivetAPI = new RivetAPI(this.config.clientId, this.config.token);
            let users = await rivetAPI.getUsers();
            status.totalSourceRecord = users.length
            
            let kpaUsers : KPAUserModel[] = [];
            for(let user of users) {
                var kpaUser : KPAUserModel | null = null;
                for (let i = 0; i < kpaExistUsers.length; i++) {
                    const kpaExistUser = kpaExistUsers[i];
                    if (kpaExistUser.employeeNumber === user.employeeId) {
                        kpaUser = kpaExistUser;
                        kpaExistUsers.splice(i,1);
                        break;
                    }
                }

                //Build KPA user Data and Check existing
                if (kpaUser == null) {
                    kpaUser = new KPAUserModel();
                    if (user.terminationDate !== null) {
                        // console.log(`Skip User because of Termination Date ${user.employeeId} ${user.terminationDate}`)
                        status.skippedRecord++
                        continue;
                    }
                } else {
                    if (!this.config.isEditUser) {
                        // console.log(`Skip User because of Cannot Allow to edit ${user.employeeId}`)
                        status.skippedRecord++
                        continue;
                    }
                    if (user.terminationDate !== null) {
                        status.inactivatedRecord++
                    }
                }

                kpaUser.employeeNumber = user.employeeId;
                kpaUser.firstName = user.firstName
                kpaUser.lastName = user.lastName;
                kpaUser.username = user.employeeId;
                kpaUser.email = user.email;
                kpaUser.initialPassword = `${user.employeeId}.kpaehs!!`;
                kpaUser.role = 'Employee';
                kpaUser.terminationDate = user.terminationDate;

                kpaUsers.push(kpaUser);
                status.upsertRecord++;
            }
            
            //Send Data
            // console.log(kpaUsers)
            console.log(kpaUsers.length)
            const success = await kpaUserAPI.saveUser(this.config.kpaSite, this.config.emailReport, kpaUsers)
            if (!success) {
                console.log('Failed to save Users')
            }
        } catch (e) {
            console.log(`Worker Stop with Error : ${e}`)
            //Send an email to failed;
        }
        console.log("Execute RivetUserJob Done");
    }

}