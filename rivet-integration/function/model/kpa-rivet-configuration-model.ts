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

    syncChanges():Document {
        super.syncChanges();

        this.doc['client_id'] = this.clientId;
        this.doc['token'] = this.token;

        return this.doc;
    }
}
