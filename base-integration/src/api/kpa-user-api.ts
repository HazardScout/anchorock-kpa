import axios, { Axios } from "axios";
import { KPAUserModel } from "../model";
import { Helper } from "../utilities";
import { debuglog } from 'util';

export class KPAUserAPI {
    token: string;
    apiInstance: Axios;

    constructor(token: string) {
        this.token = token;
        this.apiInstance = axios.create({baseURL: 'https://api.kpaehs.com/v1'})
    }

    async getAllUser():Promise<KPAUserModel[]> {
        let result : KPAUserModel[] = [];
        const { data } = await this.apiInstance.post('users.list', {token:this.token});
        for (var userData of data.users) {
            let user = Object.assign(new KPAUserModel(), userData);
            result.push(user);
        }
        return result;
    }

    async saveUser(site: string, models: KPAUserModel[], isEditUSer: boolean) : Promise<boolean> {
        var cleanRecords : KPAUserModel[] = []
        var invalidRecords : KPAUserModel[] = []

        for (var model of models) {

            //Ignore user without employee number
            if (model.employeeNumber === null || model.employeeNumber === '') {
                invalidRecords.push(model)
                continue;
            }

            var isDuplicate = false;
            for (let i = 0; i < cleanRecords.length; i++) {
                var clearRecord : KPAUserModel = cleanRecords[i];
                if (clearRecord.username === model.username || clearRecord.employeeNumber === model.employeeNumber) {
                    isDuplicate = true;
                    invalidRecords.push(model)
                    invalidRecords.push(clearRecord)
                    cleanRecords.splice(i, 1);
                    break;
                }
            }

            if (!isDuplicate) {
                for (var invalidRecord of invalidRecords) {
                    if (invalidRecord.username === model.username || invalidRecord.employeeNumber === model.employeeNumber) {
                        isDuplicate = true;
                        invalidRecords.push(model)
                        break;
                    }
                }
            }

            if (!isDuplicate) {
                cleanRecords.push(model)
            }
        }

        if (cleanRecords.length > 0) {
            await this.#sendDataToKPA(site, cleanRecords, isEditUSer)
        }

        if (invalidRecords.length > 0) {
            await this.#sendDataToKPA(site, invalidRecords, isEditUSer)
        }

        return true;
    }

    async #sendDataToKPA(site: string, models: KPAUserModel[], isEditUSer: boolean) : Promise<boolean> {

        let headers = '';
        if (isEditUSer) {
            headers = 'Site,RecordType,Name,EmployeeNumber,FirstName,LastName,Username,InitialPassword,Role,Title,Email,TerminationDate,ForcePasswordSelection,SendWelcomeEmail,UpdatePolicy';
        } else {
            headers = 'Site,RecordType,Name,EmployeeNumber,FirstName,LastName,Username,InitialPassword,Role,Title,Email,TerminationDate,ForcePasswordSelection,SendWelcomeEmail';
        }

        var jobTitles = [];
        for(var model of models) {
            if (model.title != null && model.title !== '' && jobTitles.indexOf(model.title) == -1) {
                jobTitles.push(model.title);
            }
        }

        var content = `${headers}`;

        for(var jobTitle of jobTitles) {

            var dataUser = `${site},JobTitle`
            dataUser = `${dataUser},${Helper.csvContentChecker(jobTitle)}`
            content = `${content}\n${dataUser}`
        }

        for(var model of models) {

            var dataUser = `${site},Employee,`
            dataUser = `${dataUser},${Helper.csvContentChecker(model.employeeNumber)}`
            dataUser = `${dataUser},${Helper.csvContentChecker(model.firstName)}`
            dataUser = `${dataUser},${Helper.csvContentChecker(model.lastName)}`
            dataUser = `${dataUser},${Helper.csvContentChecker(model.username)}`
            dataUser = `${dataUser},${Helper.csvContentChecker(model.initialPassword)}`
            dataUser = `${dataUser},${Helper.csvContentChecker(model.role)}`
            dataUser = `${dataUser},${Helper.csvContentChecker(model.title)}`
            dataUser = `${dataUser},${Helper.csvContentChecker(model.email)}`
            dataUser = `${dataUser},${Helper.csvContentChecker(model.terminationDate ?? '')}`
            dataUser = `${dataUser},${model.resetPassword ? 'Y': 'N'}`
            dataUser = `${dataUser},${model.welcomeEmail ? 'Y': 'N'}`

            if (isEditUSer) {
                dataUser = `${dataUser},Always`
            }

            content = `${content}\n${dataUser}`
        }

        const fileData = Buffer.from(content, 'binary').toString('base64');

        const { data } = await this.apiInstance.post('dataload.create', {
            token:this.token,
            file: `data:text/csv;base64,${fileData}`,
            name: 'employees.csv',
            failureEmails: [],
            successEmails: []
        });

        debuglog('log:worker:dataload-response')('employees', data)
        if (!data.ok) {
            throw new Error(`${data.error}:${data.description}`);
        }

        return data.ok;
    }

}