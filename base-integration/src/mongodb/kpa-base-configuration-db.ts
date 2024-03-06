import { Document, MongoClient } from "mongodb";
import { KPABaseConfigurationModel } from "../model";

export abstract class KPABaseConfigurationDB<T> {
    mongoDbUrl: string;
    abstract collectionName: string;

    constructor() {
        this.mongoDbUrl = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/?authMechanism=DEFAULT`;
    }

    async getConfiguration(filter:any = {}) : Promise<T[]> {
        let result: T[] = []
        const mongoClient = await MongoClient.connect(this.mongoDbUrl);
        const mongoDb = mongoClient.db(`${process.env.MONGODB_DBNAME}`);

        let mongoDbCollection = mongoDb.collection(this.collectionName);
        const findResult = await mongoDbCollection.find(filter).toArray();
        for(var data of findResult) {
            result.push(this.convertData(data))
        }

        await mongoClient.close();

        return result;
    }

    async getConfigurationByKpaToken(kpaToken: String) : Promise<T | null> {
        let result: T[] = []
        const mongoClient = await MongoClient.connect(this.mongoDbUrl);
        const mongoDb = mongoClient.db(`${process.env.MONGODB_DBNAME}`);

        let mongoDbCollection = mongoDb.collection(this.collectionName);
        const findResult = await mongoDbCollection.find({kpa_token: kpaToken}).toArray();
        for(var data of findResult) {
            result.push(this.convertData(data))
        }

        await mongoClient.close();

        if (result.length == 0) {
            return null
        }

        return result[0]
    }

    async save(model: KPABaseConfigurationModel) : Promise<KPABaseConfigurationModel> {
        const mongoClient = await MongoClient.connect(this.mongoDbUrl);
        const mongoDb = mongoClient.db(`${process.env.MONGODB_DBNAME}`)
        let mongoDbCollection = mongoDb.collection(this.collectionName);

        const doc = model?.syncChanges();
        if (!doc) {
            throw new Error('no document to save');
        }

        const filter = { kpa_token: doc.kpa_token };
        const count = await mongoDbCollection.count(filter);

        if (count) {
            await mongoDbCollection.updateOne(filter, {
                $set: doc
            });
        } else {
            await mongoDbCollection.insertOne(doc);
        }

        await mongoClient.close();
        return model;
    }

    abstract convertData(data: Document) : T;
}
