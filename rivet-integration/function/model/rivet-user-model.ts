export class RivetUserModel {
    id: string;
    employeeId: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    city: string;
    state: string;
    zip: string;
    address: string;
    hireDate: string;
    terminationDate: string;
    
    constructor(data: any) {
        this.id = data['id'];
        this.employeeId = data['employeeid'];
        this.email = data['email'];
        this.firstName = data['firstname'];
        this.lastName = data['lastname'];
        this.phoneNumber = data['mobilenumber'];
        this.city = data['city'];
        this.state = data['state'];
        this.zip = data['zip'];
        this.address = data['address'];
        this.hireDate = data['hiredate'];
        this.terminationDate = data['terminationdate'];
    }
}