import { Document } from "mongodb";
import { KPABaseConfigurationModel } from "../../../base-integration/src/model";

export class KPAProcoreConfigurationModel extends KPABaseConfigurationModel {
    procoreCompanies : string[];
    procoreToken : string;
    procoreRefreshToken : string;

    constructor(data: Document) {
        super(data)
        this.procoreCompanies = data['procore_companies'];
        this.procoreToken = data['procore_token'];
        this.procoreRefreshToken = data['procore_refresh_token'];
    }
}