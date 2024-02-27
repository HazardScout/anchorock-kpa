import { RivetProjectModel, RivetUserModel } from "../model";
export declare class RivetAPI {
    private apiInstance;
    constructor(clientId: string, token: string);
    getProjects(): Promise<RivetProjectModel[]>;
    getUsers(): Promise<RivetUserModel[]>;
}
