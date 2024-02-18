export class KPAProjectModel {
    id : string;
    name : string;
    code : string;
    isActive : Boolean;
    address : string;
    city : string;
    state : string;
    zip : string;


    constructor() {
        this.id = "";
        this.name = "";
        this.code = "";
        this.isActive = true;
        this.address = "";
        this.city = "";
        this.state = "";
        this.zip = "";

    }
}