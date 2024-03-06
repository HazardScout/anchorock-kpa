import { Document } from "mongodb";
export declare abstract class KPABaseConfigurationModel {
    protected doc: Document;
    kpaSite: string;
    kpaToken: string;
    isSyncUser: boolean;
    isSyncProject: boolean;
    isEditUser: boolean;
    isEditProject: boolean;
    defaultRole: string;
    isForceResetPassword: boolean;
    isWelcomeEmail: boolean;
    constructor(document?: Document);
    syncChanges(): Document;
}
