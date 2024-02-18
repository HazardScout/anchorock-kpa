import axios, { Axios } from "axios";
import { RivetProjectModel, RivetUserModel } from "../model";

export class RivetAPI {
    private apiInstance: Axios;

    constructor(clientId: string, token: string) {
        this.apiInstance = axios.create({
            baseURL: 'https://api.rivet.work'
        })

        this.apiInstance.defaults.headers.common['clientid'] = clientId
        this.apiInstance.defaults.headers.common['token'] = token
        this.apiInstance.defaults.headers.common['Accept'] = 'application/json';
        this.apiInstance.defaults.headers.common['Content-Type'] = 'application/json';
    }

    async getProjects() : Promise<RivetProjectModel[]> {
        const result: RivetProjectModel[] = [];
        const { data } = await this.apiInstance.get('/api/v1/jobs')
        for(var project of data) {
            result.push(new RivetProjectModel(project))
        }

        return result;
    }

    async getUsers() : Promise<RivetUserModel[]> {
        const result: RivetUserModel[] = [];
        const { data } = await this.apiInstance.get('/api/v1/workers')
        for(var user of data) {
            result.push(new RivetUserModel(user))
        }

        return result;
    }



}