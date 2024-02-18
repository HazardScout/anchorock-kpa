import { ProcoreProjectStageModel } from "./procore-project-stage-model";

export  class ProcoreProjectModel {
    id: number;
    name: string;
    project_number: string;
    address: string;
    state_code: string;
    city: string;
    zip: string;
    active: boolean;
    project_stage: ProcoreProjectStageModel;

    constructor() {
        this.id = 0;
        this.name = '';
        this.project_number = '';
        this.address = '';
        this.state_code = '';
        this.city = '';
        this.zip = '';
        this.active = false;
        this.project_stage = new ProcoreProjectStageModel();
    }
}