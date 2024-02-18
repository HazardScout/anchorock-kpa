export class RivetProjectModel {
    id: string;
    jobName: string;
    jobNumber: string;
    jobStatus: string;
    description: string;
    zip: string;
    address: string;
    state: string;
    city: string;

    constructor(data: any) {
        this.id = data['id']
        this.jobName = data['jobname']
        this.jobNumber = data['jobnumber']
        this.jobStatus = data['jobstatus']
        this.description = data['description']
        this.zip = data['zip']
        this.address = data['address']
        this.state = data['state']
        this.city = data['city']
    }
}