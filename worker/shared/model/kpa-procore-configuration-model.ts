export class KPAProcoreConfigurationModel {
    id : string;
    customerId: string;
    kpaSite: string;
    kpaToken: string;
    procoreCompanyName : string;
    procoreToken : string;
    procoreRefreshToken : string;
    emailReport : string[];
    isSyncUser : boolean;
    isSyncProject : boolean;

    constructor() {
        this.id = "";
        this.customerId = "";
        this.kpaSite = "";
        this.kpaToken = "";
        this.procoreCompanyName = "";
        this.procoreToken = "";
        this.procoreRefreshToken = "";
        this.isSyncUser = false;
        this.isSyncProject = false;
        this.emailReport = [];
    }
}