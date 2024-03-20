export class ProcoreAuthModel {
    accessToken: string;
    refreshToken: string;
    clientId: string;
    clientSecret: string;

    constructor(accessToken: string, refreshToken: string) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        
        //Sandbox ClientId & Client Secret
        this.clientId = '4ad8901b442aa57d8e784b3281a382012c7360a4b0afff382c2e118701936545';
        this.clientSecret = 'f9ea03ce83958e379048339e347e3c5f76c69633360b142e045d9c4fdf349f9d';
    }
}