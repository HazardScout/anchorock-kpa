import axios, { Axios } from "axios";
import { ProcoreAuthModel, ProcoreCompanyModel, ProcoreProjectModel, ProcoreUserModel } from "../model";

export class ProcoreAPI {
    auth: ProcoreAuthModel;
    authInstance: Axios;
    apiInstance: Axios;
    resaveToken: (auth: ProcoreAuthModel) => Promise<void>;

    constructor(auth: ProcoreAuthModel, resaveToken: (auth: ProcoreAuthModel) => Promise<void>) {
        this.auth = auth;
        this.resaveToken = resaveToken;

        this.authInstance = axios.create({
            baseURL: 'https://login.procore.com/oauth/token/'
        });

        this.authInstance.defaults.headers.post['Accept'] = 'application/json';
        this.authInstance.defaults.headers.post['Content-Type'] = 'application/json';

        this.apiInstance = axios.create({
            baseURL: 'https://api.procore.com/rest/v1.0/'
        });

        this.apiInstance.defaults.headers.common['Authorization'] = auth.accessToken;
        this.apiInstance.defaults.headers.post['Accept'] = 'application/json';
        this.apiInstance.defaults.headers.post['Content-Type'] = 'application/json';
    }

    async refreshToken(): Promise<ProcoreAuthModel> {
        return new ProcoreAuthModel('1','1');
    }

    async getCompanies()  : Promise<ProcoreCompanyModel[]>{
        const result: ProcoreCompanyModel[] = [];
        try {
            const { data } = await this.apiInstance
            .get('/companies')
            for (var companyData of data) {
                let company = Object.assign(new ProcoreCompanyModel(), companyData);
                result.push(company);
            }
        } catch(e) {
            //For some reason, Cannot acess status on error Response
            const errorResponse = JSON.parse(JSON.stringify(e));
            if (errorResponse['status'] == 401) {

                //Break Code - Temporary
                if (this.auth.refreshToken === '1') {
                    throw {'message':'Request Failed - Invalid token and refresh token'};
                }

                console.log('Refresh Token')
                this.auth = await this.refreshToken();
                this.resaveToken(this.auth)

                this.apiInstance.defaults.headers.common['Authorization'] = this.auth.accessToken;
                return await this.getCompanies()
            } else {
                throw {'message':'Request Failed'};
            }
        }
        return result;
    }

    async getProjects(companyId: number) : Promise<ProcoreProjectModel[]> {
        
        const result: ProcoreProjectModel[] = [];
        try {
            const { data } = await this.apiInstance
            .get('/projects', { params: { company_id: companyId } })
            for (var projectData of data) {
                let project = Object.assign(new ProcoreCompanyModel(), projectData);
                result.push(project);
            }
        } catch(e) {
            //For some reason, Cannot acess status on error Response
            const errorResponse = JSON.parse(JSON.stringify(e));
            if (errorResponse['status'] == 401) {

                //Break Code - Temporary
                if (this.auth.refreshToken === '1') {
                    throw {'message':'Request Failed - Invalid token and refresh token'};
                }

                console.log('Refresh Token')
                this.auth = await this.refreshToken();
                this.resaveToken(this.auth)

                this.apiInstance.defaults.headers.common['Authorization'] = this.auth.accessToken;
                return await this.getProjects(companyId)
            } else {
                throw {'message':'Request Failed'};
            }
        }
        return result;
    }

    async getUsers(companyId: number) : Promise<ProcoreUserModel[]> {
        const result: ProcoreUserModel[] = [];
        try {
            const { data } = await this.apiInstance
            .get('/users', { params: { company_id: companyId } })
            for (var userData of data) {
                let user = Object.assign(new ProcoreUserModel(), userData);
                result.push(user);
            }
        } catch(e) {
            //For some reason, Cannot acess status on error Response
            const errorResponse = JSON.parse(JSON.stringify(e));
            if (errorResponse['status'] == 401) {

                //Break Code - Temporary
                if (this.auth.refreshToken === '1') {
                    throw {'message':'Request Failed - Invalid token and refresh token'};
                }

                console.log('Refresh Token')
                this.auth = await this.refreshToken();
                this.resaveToken(this.auth)

                this.apiInstance.defaults.headers.common['Authorization'] = this.auth.accessToken;
                return await this.getUsers(companyId)
            } else {
                throw {'message':'Request Failed'};
            }
        }
        return result;
    }

}