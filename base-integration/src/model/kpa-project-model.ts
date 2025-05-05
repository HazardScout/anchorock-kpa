export class KPAProjectModel {
    id : string;
    name : string;
    code : string; // code is used for api integration to upload in s3
    isActive : Boolean;
    address : string;
    city : string;
    state : string;
    zip : string;    
    number: string; // number is used for KPA project
    active : Boolean; // active is used for KPA project


    constructor() {
        this.id = "";
        this.name = "";
        this.code = "";
        this.isActive = true;
        this.address = "";
        this.city = "";
        this.state = "";
        this.zip = "";
        this.number = "";
    }
}