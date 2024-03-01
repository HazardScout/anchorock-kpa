import { Document } from "mongodb";
import { KPABaseConfigurationModel } from "../../../base-integration/src/model";

export class KPAProcoreConfigurationModel extends KPABaseConfigurationModel {
    procoreCompanyIds : number[];
    procoreToken : string;
    procoreRefreshToken : string;

    constructor(data?: Document) {
        super(data)
        this.procoreCompanyIds = this.doc['procore_company_ids'];
        this.procoreToken = this.doc['procore_token'];
        this.procoreRefreshToken = this.doc['procore_refresh_token'];
    }

    syncChanges():Document {
        super.syncChanges();

        this.doc['procore_company_ids'] = this.procoreCompanyIds;
        this.doc['procore_token'] = this.procoreToken;
        this.doc['procore_refresh_token'] = this.procoreRefreshToken;

        return this.doc;
    }
}
