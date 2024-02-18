import { KPAUserAPI } from "../../../base-integration/src/api";
import { IJob, JobStatus } from "../../../base-integration/src/job";
import { KPAUserModel } from "../../../base-integration/src/model";
import { SpectrumAPI } from "../api";

export class SpectrumUserJob implements IJob {
    name: string;
    kpaSite: string;
    kpaToken: string;
    clientId: string;
    clientSecret: string;
    isEditUser: boolean;
    emailReport: string[];
    config: Map<String,Map<String, String>>;
    defaultRole: string;
    welcomeEmail: boolean;
    resetPassword: boolean;

    constructor(config: Map<String,Map<String, String>>) {
        this.name = 'Spectrum User Job';
        this.config = config;
        
        this.kpaSite = `${config.get('kpaSite')?.get('stringValue')}`;
        this.kpaToken = `${config.get('kpaToken')?.get('stringValue')}`;
        this.clientId = `${config.get('clientId')?.get('stringValue')}`;
        this.clientSecret = `${config.get('clientSecret')?.get('stringValue')}`;
        this.isEditUser = `${config.get('isEditUser')?.get('stringValue')}` === '1';
        this.defaultRole = `${config.get('defaultRole')?.get('stringValue')}`;
        this.welcomeEmail = `${config.get('welcomeEmail')?.get('stringValue')}` === '1';
        this.resetPassword = `${config.get('resetPassword')?.get('stringValue')}` === '1';

        const emailReportString = `${config.get('emailReport')?.get('stringValue')}`;
        this.emailReport = JSON.parse(emailReportString);
    }

    async execute(status: JobStatus): Promise<void> {
        console.log("Execute SpectrumUserJob Start");
        try {
            //Fetch KPA Users
            let kpaUserAPI = new KPAUserAPI(this.kpaToken);
            let kpaExistUsers = await kpaUserAPI.getAllUser();
            status.totalExistingRecord = kpaExistUsers.length;
            console.log(kpaExistUsers)

            //Fetch Spectrum Users
            let spectrumAPI = new SpectrumAPI(this.clientId, this.clientSecret);
            let users = await spectrumAPI.getUsers();
            status.totalSourceRecord = users.length

            //Loop Spectrum Users
            let kpaUsers : KPAUserModel[] = [];
            for(let user of users) {
                var kpaUser : KPAUserModel | null = null;
                for (let i = 0; i < kpaExistUsers.length; i++) {
                    const kpaExistUser = kpaExistUsers[i];
                    if (kpaExistUser.employeeNumber === user.employeeCode) {
                        kpaUser = kpaExistUser;
                        kpaExistUsers.splice(i,1);
                        break;
                    }
                }

                //Build KPA user Data and Check existing
                if (kpaUser == null) {
                    kpaUser = new KPAUserModel();
                    if (user.employeeStatus !== 'A') {
                        // console.log(`Skip User because of Termination Date ${user.employeeId} ${user.terminationDate}`)
                        status.skippedRecord++
                        continue;
                    }
                } else {
                    if (!this.isEditUser) {
                        // console.log(`Skip User because of Cannot Allow to edit ${user.employeeId}`)
                        status.skippedRecord++
                        continue;
                    }

                    if (user.employeeStatus !== 'A') {
                        status.inactivatedRecord++
                    }
                }

                //Create Users 
                kpaUser.employeeNumber = user.employeeCode;
                kpaUser.firstName = user.firstName
                kpaUser.lastName = user.lastName;
                kpaUser.username = user.employeeCode;
                kpaUser.email = '';
                kpaUser.initialPassword = `${user.employeeCode}.kpaflex!!`;
                kpaUser.role = this.defaultRole;
                kpaUser.title = user.title
                kpaUser.welcomeEmail = this.welcomeEmail
                kpaUser.resetPassword = this.resetPassword

                if (user.employeeStatus !== 'A') {
                    kpaUser.terminationDate = new Date().toDateString();
                    console.log(`Need to Check ${kpaUser.terminationDate}`)
                }

                //Add User To List
                kpaUsers.push(kpaUser);
                status.upsertRecord++;
            }
            
            //Send Data
            console.log(kpaUsers.length)
            const success = await kpaUserAPI.saveUser(this.kpaSite, this.emailReport, kpaUsers)
            if (!success) {
                console.log('Failed to save Users')
            }
        } catch(e) {
            console.log(`Worker Stop with Error : ${e}`)
        }
        console.log("Execute SpectrumUserJob Done");
    }

}