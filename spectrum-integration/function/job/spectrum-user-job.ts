import { KPAUserAPI } from "../../../base-integration/src/api";
import { IJob, JobStatus } from "../../../base-integration/src/job";
import { KPAUserModel } from "../../../base-integration/src/model";
import { SpectrumAPI } from "../api";
import { debuglog } from 'util';

export class SpectrumUserJob implements IJob {
    name: string;
    kpaSite: string;
    kpaToken: string;
    serverUrl: string;
    companyCodes: string[];
    authorizationId: string;
    isEditUser: boolean;
    config: any;
    defaultRole: string;
    welcomeEmail: boolean;
    resetPassword: boolean;

    constructor(config: any) {
        this.config = config;

        this.kpaSite = config["kpaSite"]["stringValue"];
        this.name = 'Spectrum User Job - ' + this.kpaSite;
        this.kpaToken = config["kpaToken"]["stringValue"];
        this.serverUrl = config["serverUrl"]["stringValue"];
        this.companyCodes = JSON.parse(config["companyCodes"]["stringValue"]);
        this.authorizationId = config["authorizationId"]["stringValue"];
        this.isEditUser = config["isEditUser"]["stringValue"] == '1';
        this.defaultRole = config["defaultRole"]["stringValue"];
        this.welcomeEmail = config["welcomeEmail"]["stringValue"] === '1';
        this.resetPassword = config["resetPassword"]["stringValue"] === '1';
    }

    async execute(status: JobStatus): Promise<void> {
        debuglog('log:spectrum:user')("Execute SpectrumUserJob Start");
        //Fetch KPA Users
        let kpaUserAPI = new KPAUserAPI(this.kpaToken);
        let kpaExistUsers = await kpaUserAPI.getAllUser();
        status.totalExistingRecord = kpaExistUsers.length;
        debuglog('log:spectrum:user')(JSON.stringify(kpaExistUsers, null, 2));

        let kpaUsers : KPAUserModel[] = [];
        for (var companyCode of this.companyCodes) {
            //Fetch Spectrum Users
            let spectrumAPI = new SpectrumAPI(this.serverUrl, this.authorizationId, companyCode);
            let users = await spectrumAPI.getUsers();
            status.totalSourceRecord = users.length

            //Loop Spectrum Users
            for (let user of users) {
                let isExistingKpaUser = false;
                var kpaUser : KPAUserModel | null = null;
                for (let i = 0; i < kpaExistUsers.length; i++) {
                    const kpaExistUser = kpaExistUsers[i];
                    const employeeCode = `${companyCode.trim()}-${user.employeeCode.trim()}`;
                    if (kpaExistUser.employeeNumber === employeeCode) {
                        kpaUser = kpaExistUser;
                        kpaExistUsers.splice(i, 1);
                        isExistingKpaUser = true
                        break;
                    }
                }

                //Build KPA user Data and Check existing
                if (kpaUser == null) {
                    kpaUser = new KPAUserModel();
                    if (user.employeeStatus !== 'A') {
                        status.skippedRecord++
                        continue;
                    }
                } else {
                    if (!this.isEditUser) {
                        status.skippedRecord++
                        continue;
                    }

                    if (user.employeeStatus !== 'A') {
                        status.inactivatedRecord++
                    }
                }

                //Create Users
                kpaUser.employeeNumber = `${companyCode.trim()}-${user.employeeCode.trim()}`;
                kpaUser.firstName = user.firstName
                kpaUser.lastName = user.lastName;
                kpaUser.username = `${companyCode.trim()}-${user.employeeCode.trim()}`;
                kpaUser.email = '';
                kpaUser.initialPassword = `KPAFlex2024!!`;
                kpaUser.role = isExistingKpaUser ? '' : this.defaultRole;
                kpaUser.title = user.title
                kpaUser.welcomeEmail = this.welcomeEmail
                kpaUser.resetPassword = this.resetPassword

                if (user.employeeStatus !== 'A' && kpaUser.terminationDate == null) {
                    kpaUser.terminationDate = new Date().toDateString();
                    debuglog('log:spectrum:user')(`Need to Check ${kpaUser.terminationDate}`)
                }

                //Add User To List
                kpaUsers.push(kpaUser);
                status.upsertRecord++;
            }
        }

        //Send Data
        debuglog('log:spectrum:user')(String(kpaUsers.length))
        const success = await kpaUserAPI.saveUser(this.kpaSite, kpaUsers, this.isEditUser)
        if (!success) {
            throw new Error('Failed to save Users:' + this.config.kpaSite);
        }
        debuglog('log:spectrum:user')("Execute SpectrumUserJob Done");
    }

}
