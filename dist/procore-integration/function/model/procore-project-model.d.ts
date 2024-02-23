import { ProcoreProjectStageModel } from "./procore-project-stage-model";
export declare class ProcoreProjectModel {
    id: number;
    name: string;
    project_number: string;
    address: string;
    state_code: string;
    city: string;
    zip: string;
    active: boolean;
    project_stage: ProcoreProjectStageModel;
    constructor();
}
