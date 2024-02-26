import { Document } from "mongodb";

export abstract class KPABaseConfigurationModel {
    kpaSite: string;
    kpaToken: string;
    isSyncUser : boolean;
    isSyncProject : boolean;
    isEditUser : boolean;
    isEditProject : boolean;
    defaultRole : string;
    isForceResetPassword : boolean;
    isWelcomeEmail : boolean;

    constructor(data: Document) {
        this.kpaSite = data['kpa_site'];
        this.kpaToken = data['kpa_token'];
        this.isSyncUser = data['is_sync_user'];
        this.isSyncProject = data['is_sync_project'];
        this.isEditUser = data['is_edit_user'];
        this.isEditProject = data['is_edit_project'];
        this.defaultRole = data['default_role'];
        this.isForceResetPassword = data['is_force_reset_password'];
        this.isWelcomeEmail = data['is_welcome_email'];
    }
}