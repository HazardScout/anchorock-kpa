import { Axios } from "axios";
import { procoreContext, ProcoreCompanyModel, ProcoreProjectModel, ProcoreUserModel } from "../model";
export declare class ProcoreAPI {
    auth: procoreContext;
    authInstance: Axios;
    apiInstance: Axios;
    resaveToken: (auth: procoreContext) => Promise<void>;
    constructor(auth: procoreContext, resaveToken: (auth: procoreContext) => Promise<void>);
    refreshToken(): Promise<procoreContext>;
    getCompanies(): Promise<ProcoreCompanyModel[]>;
    getProjects(companyId: number): Promise<ProcoreProjectModel[]>;
    getUsers(companyId: number): Promise<ProcoreUserModel[]>;
}
