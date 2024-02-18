import axios, { Axios } from "axios";
import { KPAUserModel } from "../model";
import { Helper } from "../utilities";

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

    async saveUser(site: string, emailReport:string[], models: KPAUserModel[]) : Promise<boolean> {
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
            failureEmails: emailReport,
            successEmails: emailReport
        });

        return data.ok;
    }

}