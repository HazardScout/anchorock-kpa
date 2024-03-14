import axios, { Axios } from "axios";
import { procoreContext, ProcoreCompanyModel, ProcoreProjectModel, ProcoreUserModel } from "../model";

export class ProcoreAPI {
    auth: procoreContext;
    authInstance: Axios;
    apiInstance: Axios;
    resaveToken: (auth: procoreContext) => Promise<void>;

    constructor(auth: procoreContext, resaveToken: (auth: procoreContext) => Promise<void>) {
        this.auth = auth;
        this.resaveToken = resaveToken;

        this.authInstance = axios.create({
            baseURL: 'https://login.procore.com/oauth/token/'
            // baseURL: 'https://login-sandbox.procore.com/oauth/token/'
        });

        this.authInstance.defaults.headers.post['Accept'] = 'application/json';
        this.authInstance.defaults.headers.post['Content-Type'] = 'application/json';

        this.apiInstance = axios.create({
            baseURL: 'https://api.procore.com/rest/v1.0/'
            // baseURL: 'https://sandbox.procore.com/rest/v1.0/'
        });

        this.apiInstance.defaults.headers.common['Authorization'] = `Bearer ${auth.accessToken}`;
        this.apiInstance.defaults.headers.post['Accept'] = 'application/json';
        this.apiInstance.defaults.headers.post['Content-Type'] = 'application/json';
    }

    async refreshToken(): Promise<procoreContext> {
        try {
            const { data } = await this.authInstance.post('', {grant_type: 'refresh_token', refresh_token: this.auth.refreshToken});

            const accessToken = data['access_token'];
            const refreshToken = data['refresh_token'];
            return new procoreContext(accessToken, refreshToken);
        } catch(e:any) {
            throw new Error(JSON.stringify(e.response?.data || e));
        }
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
        } catch(e:any) {
            //For some reason, Cannot acess status on error Response
            const errorResponse = JSON.parse(JSON.stringify(e));
            if (errorResponse['status'] == 401) {

                //Break Code - Temporary
                if (this.auth.refreshToken === '1') {
                    throw new Error(JSON.stringify(e.response?.data || e));
                }

                this.auth = await this.refreshToken();
                await this.resaveToken(this.auth)

                this.apiInstance.defaults.headers.common['Authorization'] = `Bearer ${this.auth.accessToken}`;
                return await this.getCompanies()
            } else {
                throw new Error(JSON.stringify(e.response?.data || e));
            }
        }
        return result;
    }

    async getProjects(companyId: number) : Promise<ProcoreProjectModel[]> {

        const result: ProcoreProjectModel[] = [];
        try {
            const { data } = await this.apiInstance
            .get('/projects', { params: { company_id: companyId } , headers: { 'Procore-Company-Id': `${companyId}`}})
            for (var projectData of data) {
                let project = Object.assign(new ProcoreCompanyModel(), projectData);
                result.push(project);
            }
        } catch(e:any) {
            //For some reason, Cannot acess status on error Response
            const errorResponse = JSON.parse(JSON.stringify(e));
            if (errorResponse['status'] == 401) {

                //Break Code - Temporary
                if (this.auth.refreshToken === '1') {
                    throw new Error(JSON.stringify(e.response?.data || e));
                }

                this.auth = await this.refreshToken();
                await this.resaveToken(this.auth)

                this.apiInstance.defaults.headers.common['Authorization'] = `Bearer ${this.auth.accessToken}`;
                return await this.getProjects(companyId)
            } else {
                throw new Error(JSON.stringify(e.response?.data || e));
            }
        }
        return result;
    }

    async getUsers(companyId: number) : Promise<ProcoreUserModel[]> {
        const result: ProcoreUserModel[] = [];
        try {
            const { data } = await this.apiInstance
            .get('/users', { params: { company_id: companyId } , headers: { 'Procore-Company-Id': `${companyId}`}})
            for (var userData of data) {
                let user = Object.assign(new ProcoreUserModel(), userData);
                result.push(user);
            }
        } catch(e:any) {
            //For some reason, Cannot acess status on error Response
            const errorResponse = JSON.parse(JSON.stringify(e));
            if (errorResponse['status'] == 401) {

                //Break Code - Temporary
                if (this.auth.refreshToken === '1') {
                    throw new Error(JSON.stringify(e.response?.data || e));
                }

                this.auth = await this.refreshToken();;
                await this.resaveToken(this.auth)

                this.apiInstance.defaults.headers.common['Authorization'] = `Bearer ${this.auth.accessToken}`;
                return await this.getUsers(companyId)
            } else {
                throw new Error(JSON.stringify(e.response?.data || e));
            }
        }
        return result;
    }

}
