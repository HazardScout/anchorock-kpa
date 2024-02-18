import { Document } from "mongodb";
import { KPABaseConfigurationModel } from "../../../base-integration/src/model";

export class KPARivetConfigurationModel extends KPABaseConfigurationModel {
    clientId: string;
    token: string;

    constructor(data: Document) {
        super(data)
        this.clientId = data['client_id'];
        this.token = data['token'];
    }
}