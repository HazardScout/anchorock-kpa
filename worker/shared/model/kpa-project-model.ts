export class KPAProjectModel {
    id : string;
    name : string;
    code : string;
    manager_id : string;
    inactive : boolean;

    constructor() {
        this.id = "";
        this.name = "";
        this.code = "";
        this.manager_id = "";
        this.inactive = false;
    }
}