import { Document, MongoClient } from "mongodb";
import { KPABaseConfigurationDB } from "../../../base-integration/src/mongodb";
import { KPAProcoreConfigurationModel } from "../model";

export class KPAProcoreConfigurationDB extends KPABaseConfigurationDB<KPAProcoreConfigurationModel> {
    collectionName: string;

    constructor() {
        super()
        this.collectionName = 'procoreconfigs';
    }

    convertData(data: Document): KPAProcoreConfigurationModel {
        return new KPAProcoreConfigurationModel(data);
    }

    async updateProcoreToken(data: KPAProcoreConfigurationModel) : Promise<KPAProcoreConfigurationModel> {
        const mongoClient = await MongoClient.connect(this.mongoDbUrl);
        const mongoDb = mongoClient.db(`${process.env.MONGODB_DBNAME}`)
        let mongoDbCollection = mongoDb.collection(this.collectionName);

        await mongoDbCollection.updateOne({kpa_token: data.kpaToken}, {$set: {
            procore_token: data.procoreToken,
            procore_refresh_token: data.procoreRefreshToken
        }});

        await mongoClient.close();
        return data;
    }
}
