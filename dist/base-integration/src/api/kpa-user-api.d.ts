import { Axios } from "axios";
import { KPAUserModel } from "../model";
export declare class KPAUserAPI {
    #private;
    token: string;
    apiInstance: Axios;
    constructor(token: string);
    getAllUser(): Promise<KPAUserModel[]>;
    saveUser(site: string, models: KPAUserModel[], isEditUSer: boolean): Promise<boolean>;
}
