import axios, { Axios } from "axios";
import { KPAProjectModel } from "../model/kpa-project-model";
import { Helper } from "../../utilities";

export class KPAProjectAPI {
    token: string;
    apiInstance: Axios;

    constructor(token: string) {
        this.token = token;
        this.apiInstance = axios.create({baseURL: 'https://api.kpaehs.com/v1'})
    }

    async getAllProject():Promise<KPAProjectModel[]> {
        let result : KPAProjectModel[] = [];
        const { data } = await this.apiInstance.post('fieldoffices.list', {token:this.token});
        for (var projectData of data) {
            let project = Object.assign(new KPAProjectModel(), projectData);
            result.push(project);
        }
        return result;
    }

    async saveProject(site: string, emailReport: string[], models: KPAProjectModel[]) : Promise<boolean> {

        let headers = 'Site,RecordType,Name,Code';
        var content = `${headers}`;
        for(var model of models) {
            content = `${content}\n\r${site},FieldOffice,${Helper.csvContentChecker(model.name)},${Helper.csvContentChecker(model.code)}`
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