import { SpectrumProjectModel, SpectrumUserModel } from "../model";
export declare class SpectrumAPI {
    private apiInstance;
    private serverUrl;
    private authorizationId;
    private companyCode;
    private xmlParser;
    private xmlBuilder;
    constructor(serverUrl: string, authorizationId: string, companyCode: string);
    getProjects(): Promise<SpectrumProjectModel[]>;
    getUsers(): Promise<SpectrumUserModel[]>;
}
