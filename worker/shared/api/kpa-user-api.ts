import axios, { Axios } from "axios";
import { KPAUserModel } from "../model";

export class KPAUserAPI {
    token: string;
    apiInstance: Axios;

    constructor(token: string) {
        this.token = token;
        this.apiInstance = axios.create({baseURL: 'https://api.kpaehs.com/v1'})
    }

    async getAllUser():Promise<KPAUserModel[]> {
        return [];
    }

    async saveUser(model: KPAUserModel) : Promise<boolean> {
        return true;
    }

}