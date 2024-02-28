import axios, { Axios } from "axios";
import { KPAProjectModel } from "../model";
import { Helper } from "../utilities";
import { clear } from "console";

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

    async saveProject(site: string, models: KPAProjectModel[]) : Promise<boolean> {

        var clearRecords : KPAProjectModel[] = []
        var duplicateRecords : KPAProjectModel[] = []

        for (var model of models) {
            var isDuplicate = false;
            for (let i = 0; i < clearRecords.length; i++) {
                var clearRecord : KPAProjectModel = clearRecords[i];
                if (clearRecord.code === model.code) {
                    isDuplicate = true;
                    duplicateRecords.push(model)
                    duplicateRecords.push(clearRecord)
                    clearRecords.splice(i, 1);
                    break;
                }
            }

            if (!isDuplicate) {
                for (var duplicateRecord of duplicateRecords) {
                    if (duplicateRecord.code === model.code) {
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

    async #sendDataToKPA(site: string, models: KPAProjectModel[]) : Promise<boolean> {

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
            failureEmails: [],
            successEmails: []
        });

        console.log(data)

        return data.ok;
    }

}