import { Document } from "mongodb";
import { KPABaseConfigurationModel } from "../../../base-integration/src/model";

export class KPAProcoreConfigurationModel extends KPABaseConfigurationModel {
    procoreCompanies : string[];
    procoreToken : string;
    procoreRefreshToken : string;

    constructor(data?: Document) {
        super(data)
        this.procoreCompanies = this.doc['procore_companies'];
        this.procoreToken = this.doc['procore_token'];
        this.procoreRefreshToken = this.doc['procore_refresh_token'];
    }

    syncChanges():Document {
        super.syncChanges();

        this.doc['procore_companies'] = this.procoreCompanies;
        this.doc['procore_token'] = this.procoreToken;
        this.doc['procore_refresh_token'] = this.procoreRefreshToken;

        return this.doc;
    }
}
