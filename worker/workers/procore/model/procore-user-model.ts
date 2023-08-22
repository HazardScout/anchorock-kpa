export class ProcoreUserModel {

    first_name: string;
    last_name: string;
    email_address: string;
    job_title: string;
    employee_id: string;
    is_active: boolean;
    is_employee: boolean;

    constructor() {
        this.first_name = '';
        this.last_name = '';
        this.email_address = '';
        this.job_title = '';
        this.employee_id = '';
        this.is_active = false;
        this.is_employee = false;
    }
}