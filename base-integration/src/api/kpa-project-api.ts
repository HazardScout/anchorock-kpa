import axios, { Axios } from "axios";
import { KPAProjectModel } from "../model";
import { Helper } from "../utilities";
import { debuglog } from 'util';

export class KPAProjectAPI {
    token: string;
    apiInstance: Axios;

    constructor(token: string) {
        this.token = token;
        this.apiInstance = axios.create({baseURL: `https://api.${process.env.SITE_DOMAIN}/v1`})
    }

    async getAllProject():Promise<KPAProjectModel[]> {
        let result : KPAProjectModel[] = [];
        let page = 1; // first page
        let totalPages = 1; // total pages
        const maxLimit = 500; // max limit

        do {
          const { data } = await this.apiInstance.post('projects.list', {'token':this.token, 'limit': maxLimit, 'page': page});
          debuglog('log:base:projects')(data)
          page++;
          totalPages = data?.paging?.last_page || totalPages;
          for (var projectData of data?.projects) {
            let project = Object.assign(new KPAProjectModel(), projectData);
            result.push(project);
          }
        } while(page <= totalPages);

        return result;
    }

    async saveProject(site: string, models: KPAProjectModel[]) : Promise<boolean> {

        var cleanRecords : KPAProjectModel[] = []
        var invalidRecords : KPAProjectModel[] = []

        for (var model of models) {

            //Ignore Project without job number
            if (model.code === null || model.code === '') {
                invalidRecords.push(model)
                continue
            }
            if (model.name === null || model.name === '') {
                invalidRecords.push(model)
                continue
            }

            var isDuplicate = false;
            for (let i = 0; i < cleanRecords.length; i++) {
                var clearRecord : KPAProjectModel = cleanRecords[i];
                if (clearRecord.code.trim() === model.code.trim()) {
                    isDuplicate = true;
                    invalidRecords.push(model)
                    invalidRecords.push(clearRecord)
                    cleanRecords.splice(i, 1);
                    break;
                }
            }

            if (!isDuplicate) {
                for (var invalidRecord of invalidRecords) {
                    if (invalidRecord.code !== null && invalidRecord.code.trim() === model.code.trim()) {
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
            await this.#sendDataToKPA(site, cleanRecords)
        }

        if (invalidRecords.length > 0) {
            await this.#sendDataToKPA(site, invalidRecords)
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
            name: 'projects.csv',
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