import { Axios } from "axios";
import { KPAProjectModel } from "../model";
export declare class KPAProjectAPI {
    token: string;
    apiInstance: Axios;
    constructor(token: string);
    getAllProject(): Promise<KPAProjectModel[]>;
    saveProject(site: string, models: KPAProjectModel[]): Promise<boolean>;
}
