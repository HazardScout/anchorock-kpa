import { Document } from "mongodb";
import { KPABaseConfigurationDB } from "../../../base-integration/src/mongodb";
import { KPARivetConfigurationModel } from "../model/kpa-rivet-configuration-model";


export class KPARivetConfigurationDB extends KPABaseConfigurationDB<KPARivetConfigurationModel> {
    collectionName: string;

    constructor() {
        super()
        this.collectionName = 'rivetconfigs';
    }

    convertData(data: Document): KPARivetConfigurationModel {
        return new KPARivetConfigurationModel(data);
    }
    
}