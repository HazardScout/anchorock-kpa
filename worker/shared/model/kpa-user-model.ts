export class KPAUserModel {

    id: string;
    employeeNumber: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    initialPassword: string;
    role: string;
    title: string;

    constructor() {
        this.employeeNumber = '';
        this.firstName = '';
        this.lastName = '';
        this.username = '';
        this.email = '';
        this.initialPassword = '';
        this.role = '';
        this.title = '';
    }
}