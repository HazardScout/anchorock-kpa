export class SpectrumProjectModel {
    companyCode: string;
    jobNumber: string;
    jobDescription: string;
    division: string;
    address: string;
    zipCode: string;
    state: string;
    city: string;
    costCenter: string;
    statusCode: string;


    constructor(data: any) {
        this.companyCode = data['Company_Code']
        this.jobNumber = data['Job_Number']
        this.jobDescription = data['Job_Description']
        this.division = data['Division']
        this.address = data['Address_1']
        this.zipCode = data['Zip_Code']
        this.state = data['State']
        this.city = data['City']
        this.costCenter = data['Cost_Center']
        this.statusCode = data['Status_Code']
    }
}