import { Document } from "mongodb";
import { KPABaseConfigurationDB } from "../../../base-integration/src/mongodb";
import { KPAProcoreConfigurationModel } from "../model";
export declare class KPAProcoreConfigurationDB extends KPABaseConfigurationDB<KPAProcoreConfigurationModel> {
    collectionName: string;
    constructor();
    convertData(data: Document): KPAProcoreConfigurationModel;
    updateProcoreToken(data: KPAProcoreConfigurationModel): Promise<KPAProcoreConfigurationModel>;
}
