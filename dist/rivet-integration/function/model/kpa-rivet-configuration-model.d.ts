import { Document } from "mongodb";
import { KPABaseConfigurationModel } from "../../../base-integration/src/model";
export declare class KPARivetConfigurationModel extends KPABaseConfigurationModel {
    clientId: string;
    token: string;
    constructor(data: Document);
    syncChanges(): Document;
}
