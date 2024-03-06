import { Document } from "mongodb";
import { KPABaseConfigurationDB } from "../../../base-integration/src/mongodb";
import { KPASpectrumConfigurationModel } from "../model";
export declare class KPASpectrumConfigurationDB extends KPABaseConfigurationDB<KPASpectrumConfigurationModel> {
    collectionName: string;
    constructor();
    convertData(data: Document): KPASpectrumConfigurationModel;
}
