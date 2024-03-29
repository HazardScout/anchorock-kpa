import { Document } from "mongodb";
import { KPABaseConfigurationModel } from "../../../base-integration/src/model";

export class KPASpectrumConfigurationModel extends KPABaseConfigurationModel {
    authType: string;
    spectrumUrl: string;
    spectrumPort: number;
    authorizationId: string;
    companyCodes: string[];
    clientId: string;
    clientSecret: string;

    constructor(data: Document) {
        super(data);

        this.authType = data['auth_type'];
        this.spectrumUrl = data['spectrum_url'];
        this.spectrumPort = data['spectrum_port'];
        this.authorizationId = data['authorization_id'];
        this.companyCodes = data['company_codes'];
        this.clientId = data['client_id'];
        this.clientSecret = data['client_secret'];
    }

    syncChanges():Document {
        super.syncChanges();

        this.doc['auth_type'] = this.authType;
        this.doc['spectrum_url'] = this.spectrumUrl;
        this.doc['spectrum_port'] = this.spectrumPort;
        this.doc['authorization_id'] = this.authorizationId;
        this.doc['company_codes'] = this.companyCodes;
        this.doc['client_id'] = this.clientId;
        this.doc['client_secret'] = this.clientSecret;

        return this.doc;
    }
}
