import axios, { Axios } from "axios";
import { KPAUserModel } from "../model";
import { Helper } from "../utilities";
import { clear } from "console";

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

    async saveUser(site: string, models: KPAUserModel[]) : Promise<boolean> {
        var clearRecords : KPAUserModel[] = []
        var duplicateRecords : KPAUserModel[] = []

        for (var model of models) {
            var isDuplicate = false;
            for (let i = 0; i < clearRecords.length; i++) {
                var clearRecord : KPAUserModel = clearRecords[i];
                if (clearRecord.username === model.username || clearRecord.email === model.email || clearRecord.employeeNumber === model.employeeNumber) {
                    isDuplicate = true;
                    duplicateRecords.push(model)
                    duplicateRecords.push(clearRecord)
                    clearRecords.splice(i, 1);
                    break;
                }
            }

            if (!isDuplicate) {
                for (var duplicateRecord of duplicateRecords) {
                    if (duplicateRecord.username === model.username || duplicateRecord.email === model.email || duplicateRecord.employeeNumber === model.employeeNumber) {
                        isDuplicate = true;
                        duplicateRecords.push(model)
                        break;
                    }
                }
            }

            if (!isDuplicate) {
                clearRecords.push(model)
            }
        }

        if (clearRecords.length > 0) {
            await this.#sendDataToKPA(site, clearRecords)
        }

        if (duplicateRecords.length > 0) {
            await this.#sendDataToKPA(site, duplicateRecords)
        }

        return true;
    }

    async #sendDataToKPA(site: string, models: KPAUserModel[]) : Promise<boolean> {

        let headers = 'Site,RecordType,EmployeeNumber,FirstName,LastName,Username,InitialPassword,Role,Title,Email,TerminationDate,ForcePasswordSelection,SendWelcomeEmail';
        var content = `${headers}`;

        for(var model of models) {
            
            var dataUser = `${site},Employee`
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

            content = `${content}\n${dataUser}`
        }

        const fileData = Buffer.from(content, 'binary').toString('base64');
        
        const { data } = await this.apiInstance.post('dataload.create', {
            token:this.token,
            file: `data:text/csv;base64,${fileData}`,
            failureEmails: [],
            successEmails: []
        });

        console.log(data)

        return data.ok;
    }

}