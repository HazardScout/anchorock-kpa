import { Document } from "mongodb";
import { KPABaseConfigurationModel } from "../../../base-integration/src/model";
export declare class KPASpectrumConfigurationModel extends KPABaseConfigurationModel {
    clientId: string;
    clientSecret: string;
    constructor(data: Document);
    syncChanges(): Document;
}
