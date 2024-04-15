import { RivetAPI } from "../api";
import { KPAUserAPI } from "../../../base-integration/src/api";
import { JobStatus } from "../../../base-integration/src/job";
import { IJob } from "../../../base-integration/src/job/job-interface";
import { KPAUserModel } from "../../../base-integration/src/model";
import { debuglog } from 'util';

export class RivetUserJob implements IJob {
    name: string;
    kpaSite: string;
    kpaToken: string;
    clientId: string;
    token: string;
    isEditUser: boolean;
    config: any;
    defaultRole: string;
    welcomeEmail: boolean;
    resetPassword: boolean;

    constructor(config: any) {
        this.name = 'Rivet User Job';
        this.config = config;

        this.kpaSite = config["kpaSite"]["stringValue"];
        this.kpaToken = config["kpaToken"]["stringValue"];
        this.clientId = config["clientId"]["stringValue"];
        this.token = config["token"]["stringValue"];
        this.isEditUser = config["isEditUser"]["stringValue"] == '1';
        this.defaultRole = config["defaultRole"]["stringValue"];
        this.welcomeEmail = config["welcomeEmail"]["stringValue"] === '1';
        this.resetPassword = config["resetPassword"]["stringValue"] === '1';
    }

    async execute(status:JobStatus): Promise<void> {
        debuglog('log:rivet:user')("Execute RivetUserJob Start");
        let kpaUserAPI = new KPAUserAPI(this.kpaToken);
        let kpaExistUsers = await kpaUserAPI.getAllUser();
        status.totalExistingRecord = kpaExistUsers.length;
        debuglog('log:rivet:user')(JSON.stringify(kpaExistUsers, null, 2));

        let rivetAPI = new RivetAPI(this.clientId, this.token);
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
                    status.skippedRecord++
                    continue;
                }
            } else {
                if (!this.isEditUser) {
                    status.skippedRecord++
                    continue;
                }
                if (user.terminationDate !== null) {
                    status.inactivatedRecord++
                }
            }

            if (user.email === null || user.email === 'null') {
                status.skippedRecord++
                continue;
            }

            kpaUser.employeeNumber = user.employeeId;
            kpaUser.firstName = user.firstName
            kpaUser.lastName = user.lastName;
            kpaUser.username = user.email;

            if (!kpaUser.username || kpaUser.username === '') {
                kpaUser.username = user.employeeId
            }

            kpaUser.email = user.email;
            kpaUser.initialPassword = `KPAFlex2024!!`;
            kpaUser.role = this.defaultRole;
            kpaUser.terminationDate = user.terminationDate;
            kpaUser.welcomeEmail = this.welcomeEmail
            kpaUser.resetPassword = this.resetPassword

            kpaUsers.push(kpaUser);
            status.upsertRecord++;
        }

        //Send Data
        debuglog('log:rivet:user')(String(kpaUsers.length));
        const success = await kpaUserAPI.saveUser(this.kpaSite, kpaUsers, this.isEditUser);
        if (!success) {
            throw new Error('Failed to save User:' + this.config.kpaSite);
        }
        debuglog('log:rivet:user')("Execute RivetUserJob Done");
    }

}
