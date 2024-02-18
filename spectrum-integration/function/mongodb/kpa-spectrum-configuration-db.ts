import { Document } from "mongodb";
import { KPABaseConfigurationDB } from "../../../base-integration/src/mongodb";
import { KPASpectrumConfigurationModel } from "../model";


export class KPASpectrumConfigurationDB extends KPABaseConfigurationDB<KPASpectrumConfigurationModel> {
    collectionName: string;

    constructor() {
        super()
        this.collectionName = 'spectrumconfigs';
    }

    convertData(data: Document): KPASpectrumConfigurationModel {
        return new KPASpectrumConfigurationModel(data);
    }
    
}