import { Document } from "mongodb";
import { KPABaseConfigurationModel } from "../../../base-integration/src/model";
export declare class KPAProcoreConfigurationModel extends KPABaseConfigurationModel {
    procoreCompanyIds: number[];
    procoreToken: string;
    procoreRefreshToken: string;
    constructor(data?: Document);
    syncChanges(): Document;
}
