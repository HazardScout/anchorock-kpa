import { Document } from "mongodb";
import { KPABaseConfigurationDB } from "../../../base-integration/src/mongodb";
import { KPARivetConfigurationModel } from "../model/kpa-rivet-configuration-model";
export declare class KPARivetConfigurationDB extends KPABaseConfigurationDB<KPARivetConfigurationModel> {
    collectionName: string;
    constructor();
    convertData(data: Document): KPARivetConfigurationModel;
}
