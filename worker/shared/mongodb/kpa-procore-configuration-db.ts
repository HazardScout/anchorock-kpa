import { MongoClient } from "mongodb";
import { KPAProcoreConfigurationModel } from "../model";

export class KPAProcoreConfigurationDB {
    mongoDbUrl: string;
    collectionName = 'procoreconfigs';

    constructor() {
        this.mongoDbUrl = (
            process.env.MONGO_URI
            || `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/?authMechanism=DEFAULT`
        );
    }

    async getConfiguration() : Promise<KPAProcoreConfigurationModel[]> {
        let result: KPAProcoreConfigurationModel[] = []
        const mongoClient = await MongoClient.connect(this.mongoDbUrl);
        const mongoDb = mongoClient.db(`${process.env.MONGODB_DBNAME}`)

        let mongoDbCollection = mongoDb.collection(this.collectionName);
        const findResult = await mongoDbCollection.find({}).toArray();
        for(var data of findResult) {
            let configuration = new KPAProcoreConfigurationModel();
            configuration.customerId = data['customer_id'];
            configuration.kpaToken = data['kpa_token'];
            configuration.kpaSite = data['kpa_site'];
            configuration.procoreCompanyName = data['procore_company_name'];
            configuration.procoreToken = data['procore_token'];
            configuration.procoreRefreshToken = data['procore_refresh_token'];
            configuration.isSyncProject = data['is_sync_project'];
            configuration.isSyncUser = data['is_sync_user'];
            configuration.emailReport = data['email_report'];

            result.push(configuration);
        };
        await mongoClient.close();

        return result;
    }

    async updateConfiguration(data: KPAProcoreConfigurationModel) : Promise<KPAProcoreConfigurationModel> {
        const mongoClient = await MongoClient.connect(this.mongoDbUrl);
        const mongoDb = mongoClient.db(`${process.env.MONGODB_DBNAME}`)
        let mongoDbCollection = mongoDb.collection(this.collectionName);

        await mongoDbCollection.updateOne({customer_id: data.customerId}, {$set: {
            kpa_token: data.kpaToken,
            kpa_site: data.kpaSite,
            procore_company_name: data.procoreCompanyName,
            procore_token: data.procoreToken,
            procore_refresh_token: data.procoreRefreshToken,
            is_sync_project: data.isSyncProject,
            is_sync_user: data.isSyncUser
        }});

        await mongoClient.close();
        return data;
    }
}
