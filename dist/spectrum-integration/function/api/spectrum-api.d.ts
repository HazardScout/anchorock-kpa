import { SpectrumProjectModel, SpectrumUserModel } from "../model";
export declare class SpectrumAPI {
    private apiInstance;
    private expiredAt;
    private token;
    private clientId;
    private clientSecret;
    constructor(clientId: string, clientSecret: string);
    private getToken;
    private regenerateSecret;
    getProjects(): Promise<SpectrumProjectModel[]>;
    getUsers(): Promise<SpectrumUserModel[]>;
}
