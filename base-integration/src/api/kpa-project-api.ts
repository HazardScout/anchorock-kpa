import axios, { Axios } from "axios";
import { KPAProjectModel } from "../model";
import { Helper } from "../utilities";

export class KPAProjectAPI {
    token: string;
    apiInstance: Axios;

    constructor(token: string) {
        this.token = token;
        this.apiInstance = axios.create({baseURL: 'https://api.kpaehs.com/v1'})
    }

    async getAllProject():Promise<KPAProjectModel[]> {
        let result : KPAProjectModel[] = [];
        const { data } = await this.apiInstance.post('projects.list', {token:this.token});
        console.log(data)
        for (var projectData of data) {
            let project = Object.assign(new KPAProjectModel(), projectData);
            result.push(project);
        }
        return result;
    }

    async saveProject(site: string, emailReport: string[], models: KPAProjectModel[]) : Promise<boolean> {

        let headers = 'Site,RecordType,Name,Number,IsActive,Address,City,State,ZIP';
        var content = `${headers}`;
        for(var model of models) {
            content = `${content}\n${site},Project`
            content = `${content},${Helper.csvContentChecker(model.name)}`
            content = `${content},${Helper.csvContentChecker(model.code)}`
            content = `${content},${model.isActive ? 'Y':'N'}`
            content = `${content},${Helper.csvContentChecker(model.address)}`
            content = `${content},${Helper.csvContentChecker(model.city)}`
            content = `${content},${Helper.csvContentChecker(model.state)}`
            content = `${content},${Helper.csvContentChecker(model.zip)}`
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