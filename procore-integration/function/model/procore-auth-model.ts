export class ProcoreAuthModel {
    accessToken: string;
    refreshToken: string;
    clientId: string;
    clientSecret: string;

    constructor(accessToken: string, refreshToken: string) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        
        this.clientId = `${process.env.PROCORE_CLIENT_ID}`;
        this.clientSecret = `${process.env.PROCORE_CLIENT_SECRET}`;
    }
}