import { Document } from "mongodb";
import { KPABaseConfigurationModel } from "../../../base-integration/src/model";
export declare class KPAProcoreConfigurationModel extends KPABaseConfigurationModel {
    procoreCompanies: string[];
    procoreToken: string;
    procoreRefreshToken: string;
    constructor(data?: Document);
    syncChanges(): Document;
}
