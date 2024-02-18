import { Document, MongoClient } from "mongodb";

export abstract class KPABaseConfigurationDB<T> {
    mongoDbUrl: string;
    abstract collectionName: string;

    constructor() {
        this.mongoDbUrl = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/?authMechanism=DEFAULT`;
    }

    async getConfiguration() : Promise<T[]> {
        let result: T[] = []
        const mongoClient = await MongoClient.connect(this.mongoDbUrl);
        const mongoDb = mongoClient.db(`${process.env.MONGODB_DBNAME}`);

        let mongoDbCollection = mongoDb.collection(this.collectionName);
        const findResult = await mongoDbCollection.find({}).toArray();
        for(var data of findResult) {
            result.push(this.convertData(data))
        }

        await mongoClient.close();
        
        return result;
    }

    abstract convertData(data: Document) : T;
}