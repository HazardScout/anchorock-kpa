"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KPAProcoreConfigurationDB = void 0;
const mongodb_1 = require("mongodb");
const mongodb_2 = require("../../../base-integration/src/mongodb");
const model_1 = require("../model");
class KPAProcoreConfigurationDB extends mongodb_2.KPABaseConfigurationDB {
    constructor() {
        super();
        this.collectionName = 'procoreconfigs';
    }
    convertData(data) {
        return new model_1.KPAProcoreConfigurationModel(data);
    }
    async updateProcoreToken(data) {
        const mongoClient = await mongodb_1.MongoClient.connect(this.mongoDbUrl);
        const mongoDb = mongoClient.db(`${process.env.MONGODB_DBNAME}`);
        let mongoDbCollection = mongoDb.collection(this.collectionName);
        await mongoDbCollection.updateOne({ kpa_token: data.kpaToken }, { $set: {
                procore_token: data.procoreToken,
                procore_refresh_token: data.procoreRefreshToken
            } });
        await mongoClient.close();
        return data;
    }
}
exports.KPAProcoreConfigurationDB = KPAProcoreConfigurationDB;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3BhLXByb2NvcmUtY29uZmlndXJhdGlvbi1kYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2NvcmUtaW50ZWdyYXRpb24vZnVuY3Rpb24vbW9uZ29kYi9rcGEtcHJvY29yZS1jb25maWd1cmF0aW9uLWRiLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFnRDtBQUNoRCxtRUFBK0U7QUFDL0Usb0NBQXdEO0FBRXhELE1BQWEseUJBQTBCLFNBQVEsZ0NBQW9EO0lBRy9GO1FBQ0ksS0FBSyxFQUFFLENBQUE7UUFDUCxJQUFJLENBQUMsY0FBYyxHQUFHLGdCQUFnQixDQUFDO0lBQzNDLENBQUM7SUFFRCxXQUFXLENBQUMsSUFBYztRQUN0QixPQUFPLElBQUksb0NBQTRCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxJQUFrQztRQUN2RCxNQUFNLFdBQVcsR0FBRyxNQUFNLHFCQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMvRCxNQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFBO1FBQy9ELElBQUksaUJBQWlCLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFaEUsTUFBTSxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsRUFBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsSUFBSSxFQUFFO2dCQUNqRSxhQUFhLEVBQUUsSUFBSSxDQUFDLFlBQVk7Z0JBQ2hDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxtQkFBbUI7YUFDbEQsRUFBQyxDQUFDLENBQUM7UUFFSixNQUFNLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUMxQixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0NBQ0o7QUF6QkQsOERBeUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRG9jdW1lbnQsIE1vbmdvQ2xpZW50IH0gZnJvbSBcIm1vbmdvZGJcIjtcbmltcG9ydCB7IEtQQUJhc2VDb25maWd1cmF0aW9uREIgfSBmcm9tIFwiLi4vLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvbW9uZ29kYlwiO1xuaW1wb3J0IHsgS1BBUHJvY29yZUNvbmZpZ3VyYXRpb25Nb2RlbCB9IGZyb20gXCIuLi9tb2RlbFwiO1xuXG5leHBvcnQgY2xhc3MgS1BBUHJvY29yZUNvbmZpZ3VyYXRpb25EQiBleHRlbmRzIEtQQUJhc2VDb25maWd1cmF0aW9uREI8S1BBUHJvY29yZUNvbmZpZ3VyYXRpb25Nb2RlbD4ge1xuICAgIGNvbGxlY3Rpb25OYW1lOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKVxuICAgICAgICB0aGlzLmNvbGxlY3Rpb25OYW1lID0gJ3Byb2NvcmVjb25maWdzJztcbiAgICB9XG5cbiAgICBjb252ZXJ0RGF0YShkYXRhOiBEb2N1bWVudCk6IEtQQVByb2NvcmVDb25maWd1cmF0aW9uTW9kZWwge1xuICAgICAgICByZXR1cm4gbmV3IEtQQVByb2NvcmVDb25maWd1cmF0aW9uTW9kZWwoZGF0YSk7XG4gICAgfVxuXG4gICAgYXN5bmMgdXBkYXRlUHJvY29yZVRva2VuKGRhdGE6IEtQQVByb2NvcmVDb25maWd1cmF0aW9uTW9kZWwpIDogUHJvbWlzZTxLUEFQcm9jb3JlQ29uZmlndXJhdGlvbk1vZGVsPiB7XG4gICAgICAgIGNvbnN0IG1vbmdvQ2xpZW50ID0gYXdhaXQgTW9uZ29DbGllbnQuY29ubmVjdCh0aGlzLm1vbmdvRGJVcmwpO1xuICAgICAgICBjb25zdCBtb25nb0RiID0gbW9uZ29DbGllbnQuZGIoYCR7cHJvY2Vzcy5lbnYuTU9OR09EQl9EQk5BTUV9YClcbiAgICAgICAgbGV0IG1vbmdvRGJDb2xsZWN0aW9uID0gbW9uZ29EYi5jb2xsZWN0aW9uKHRoaXMuY29sbGVjdGlvbk5hbWUpO1xuXG4gICAgICAgIGF3YWl0IG1vbmdvRGJDb2xsZWN0aW9uLnVwZGF0ZU9uZSh7a3BhX3Rva2VuOiBkYXRhLmtwYVRva2VufSwgeyRzZXQ6IHtcbiAgICAgICAgICAgIHByb2NvcmVfdG9rZW46IGRhdGEucHJvY29yZVRva2VuLFxuICAgICAgICAgICAgcHJvY29yZV9yZWZyZXNoX3Rva2VuOiBkYXRhLnByb2NvcmVSZWZyZXNoVG9rZW5cbiAgICAgICAgfX0pO1xuXG4gICAgICAgIGF3YWl0IG1vbmdvQ2xpZW50LmNsb3NlKCk7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbn1cbiJdfQ==