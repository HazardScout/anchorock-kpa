import { Document } from "mongodb";
import { KPABaseConfigurationModel } from "../../../base-integration/src/model";

export class KPASpectrumConfigurationModel extends KPABaseConfigurationModel {
    clientId: string;
    clientSecret: string;

    constructor(data: Document) {
        super(data)
        this.clientId = data['client_id'];
        this.clientSecret = data['client_secret'];
    }
}