import axios, { Axios } from "axios";
import { KPAProjectModel } from "../model/kpa-project-model";

export class KPAProjectAPI {
    token: string;
    apiInstance: Axios;

    constructor(token: string) {
        this.token = token;
        this.apiInstance = axios.create({baseURL: 'https://api.kpaehs.com/v1'})
    }

    async getAllProject():Promise<KPAProjectModel[]> {
        return [];
    }

    async saveProject(model: KPAProjectModel) : Promise<boolean> {
        return true;
    }

}