import { Document } from "mongodb";
import { KPABaseConfigurationModel } from "../../../base-integration/src/model";

export class KPASpectrumConfigurationModel extends KPABaseConfigurationModel {
    serverUrl: string;
    companyCode: string;
    authorizationId: string;

    constructor(data: Document) {
        super(data)
        this.serverUrl = data['server_url'];
        this.companyCode = data['company_code'];
        this.authorizationId = data['authorization_id'];
    }

    syncChanges():Document {
        super.syncChanges();

        this.doc['server_url'] = this.serverUrl;
        this.doc['company_code'] = this.companyCode;
        this.doc['authorization_id'] = this.authorizationId;

        return this.doc;
    }
}
