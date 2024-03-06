import { Document } from "mongodb";
import { KPABaseConfigurationModel } from "../model";
export declare abstract class KPABaseConfigurationDB<T> {
    mongoDbUrl: string;
    abstract collectionName: string;
    constructor();
    getConfiguration(filter?: any): Promise<T[]>;
    getConfigurationByKpaToken(kpaToken: String): Promise<T | null>;
    save(model: KPABaseConfigurationModel): Promise<KPABaseConfigurationModel>;
    abstract convertData(data: Document): T;
}
