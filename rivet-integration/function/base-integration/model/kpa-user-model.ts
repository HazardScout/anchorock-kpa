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
    terminationDate: string | null;

    constructor() {
        this.employeeNumber = '';
        this.firstName = '';
        this.lastName = '';
        this.username = '';
        this.email = '';
        this.initialPassword = '';
        this.role = '';
        this.title = '';
        this.terminationDate = null;
    }
}