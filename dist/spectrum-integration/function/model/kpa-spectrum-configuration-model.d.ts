import { Document } from "mongodb";
import { KPABaseConfigurationModel } from "../../../base-integration/src/model";
export declare class KPASpectrumConfigurationModel extends KPABaseConfigurationModel {
    serverUrl: string;
    companyCode: string;
    authorizationId: string;
    constructor(data: Document);
    syncChanges(): Document;
}
