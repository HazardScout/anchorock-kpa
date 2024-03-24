export class SpectrumUserModel {
    companyCode: string;
    firstName: string;
    middleName: string;
    lastName: string;
    employeeCode: string;
    costCenter: string;
    employeeStatus: string;
    departementCode: string;
    unionCode: string;
    title: string;
    employeeMobilePhone: string;


    constructor(data: any) {
        this.companyCode = `${data['Company_Code']}`
        this.firstName = `${data['First_Name']}`
        this.middleName = `${data['Middle_Name']}`
        this.lastName = `${data['Last_Name']}`
        this.employeeCode = `${data['Employee_Code']}`
        this.costCenter = `${data['Cost_Center']}`
        this.employeeStatus = `${data['Employment_Status']}`
        this.departementCode = `${data['Department_Code']}`
        this.unionCode = `${data['Union_Code']}`
        this.title = `${data['Title']}`
        this.employeeMobilePhone = `${data['Employee_Mobile_Phone']}`
    }
}