import { Document } from "mongodb";
import { KPABaseConfigurationModel } from "../../../base-integration/src/model";
export declare class KPASpectrumConfigurationModel extends KPABaseConfigurationModel {
    authType: string;
    spectrumUrl: string;
    spectrumPort: number;
    authorizationId: string;
    companyCodes: string[];
    clientId: string;
    clientSecret: string;
    constructor(data: Document);
    syncChanges(): Document;
}
