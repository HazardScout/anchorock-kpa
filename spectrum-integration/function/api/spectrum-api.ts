import axios, { Axios } from "axios";
import { SpectrumProjectModel, SpectrumUserModel } from "../model";

export class SpectrumAPI {
    private apiInstance: Axios;
    private expiredAt: number;
    private token: string;
    private clientId: string;
    private clientSecret: string;

    constructor(clientId: string, clientSecret: string) {
        this.apiInstance = axios.create({
            baseURL: ''
        })

        this.expiredAt = 0;
        this.token = '';
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    private async getToken() : Promise<Boolean> {
        const { data } = await this.apiInstance.post('/connect/token', {
            'client_id': this.clientId,
            'client_secret': this.clientSecret,
            'scope': 'spectrumapi',
            'grant_type': 'client_credentials'
        })

        this.token = data['access_token']
        this.expiredAt = new Date().getTime() + data['expires_in'] * 1000


        this.apiInstance.defaults.headers.common['Authorization'] = `Basic ${this.token}`
        this.apiInstance.defaults.headers.common['Content-Type'] = 'application/json';
        return true
    }

    private async regenerateSecret() : Promise<Boolean> {
        const { data } = await this.apiInstance.post('/secretRotation', {
            'client_id': this.clientId,
            'client_secret': this.clientSecret,
            'scope': 'spectrumapi',
            'grant_type': 'client_credentials'
        })

        const clientSecret = data['client_secret']
        const estimateExpiration = data['estimated_expiration']
        console.log(clientSecret)
        console.log(estimateExpiration)
        return true
    }

    async getProjects() : Promise<SpectrumProjectModel[]> {
        const now = new Date().getTime()
        if (now > this.expiredAt) {
            await this.getToken()
        }

        const result: SpectrumProjectModel[] = [];
        const { data } = await this.apiInstance.get('/GetJob')
        for(var project of data) {
            result.push(new SpectrumProjectModel(project))
        }

        return result;
    } 

    async getUsers() : Promise<SpectrumUserModel[]> {
        const now = new Date().getTime()
        if (now > this.expiredAt) {
            await this.getToken()
        }

        const result: SpectrumUserModel[] = [];
        const { data } = await this.apiInstance.get('/GetEmployee')
        for(var project of data) {
            result.push(new SpectrumUserModel(project))
        }

        return result;
    } 
}