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
            //Get Active Users
            let users = await spectrumAPI.getUsers('A');
            status.totalSourceRecord = users.length

            //Loop Spectrum Users
            for(let user of users) {
                var kpaUser : KPAUserModel | null = null;
                for (let i = 0; i < kpaExistUsers.length; i++) {
                    const kpaExistUser = kpaExistUsers[i];
                    const employeeCode = `${companyCode.trim()}-${user.employeeCode.trim()}`;
                    if (kpaExistUser.employeeNumber === employeeCode) {
                        kpaUser = kpaExistUser;
                        kpaExistUsers.splice(i,1);
                        break;
                    }
                }

                //Build KPA user Data and Check existing
                if (kpaUser == null) {
                    kpaUser = new KPAUserModel();
                } else {
                    if (!this.isEditUser) {
                        status.skippedRecord++
                        continue;
                    }
                }

                //Create Users
                kpaUser.employeeNumber = `${companyCode.trim()}-${user.employeeCode.trim()}`;
                kpaUser.firstName = user.firstName
                kpaUser.lastName = user.lastName;
                kpaUser.username = `${companyCode.trim()}-${user.employeeCode.trim()}`;
                kpaUser.email = '';
                kpaUser.initialPassword = `KPAFlex2024!!`;
                kpaUser.role = this.defaultRole;
                kpaUser.title = user.title
                kpaUser.welcomeEmail = this.welcomeEmail
                kpaUser.resetPassword = this.resetPassword
                kpaUser.terminationDate == null

                //Add User To List
                kpaUsers.push(kpaUser);
                status.upsertRecord++;

            }
            
            // Update remaining kpaUsers as not active for this company code
            if (this.isEditUser && companyCode.trim()) {
                // Remaining existing users
                for (let i = 0; i < kpaExistUsers.length; i++) {
                    const kpaExistUser = kpaExistUsers[i];
                    // Check for employeeNumber starts with companyCode-
                    if(kpaExistUser.employeeNumber.startsWith(`${companyCode.trim()}-`) && kpaExistUser.terminationDate == null) {
                        kpaExistUser.terminationDate = new Date().toDateString();
                        debuglog('log:spectrum:user')(`Existing user need to Check ${kpaExistUser.terminationDate}`)
                        //Update User To List
                        kpaUsers.push(kpaExistUser);
                        status.upsertRecord++;
                        status.inactivatedRecord++;            
                    }
                }
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
