import { Document } from "mongodb";

export abstract class KPABaseConfigurationModel {
    protected doc: Document;
    kpaSite: string;
    kpaToken: string;
    isSyncUser : boolean;
    isSyncProject : boolean;
    isEditUser : boolean;
    isEditProject : boolean;
    defaultRole : string;
    isForceResetPassword : boolean;
    isWelcomeEmail : boolean;
    active : boolean;

    constructor(document?: Document) {
        this.doc = document || {};
        this.kpaSite = this.doc['kpa_site'];
        this.kpaToken = this.doc['kpa_token'];
        this.isSyncUser = !!this.doc['is_sync_user'];
        this.isSyncProject = !!this.doc['is_sync_project'];
        this.isEditUser = !!this.doc['is_edit_user'];
        this.isEditProject = !!this.doc['is_edit_project'];
        this.defaultRole = this.doc['default_role'];
        this.isForceResetPassword = !!this.doc['is_force_reset_password'];
        this.isWelcomeEmail = !!this.doc['is_welcome_email'];
        this.active = !!this.doc['active'];
    }

    syncChanges():Document {
        this.doc['kpa_site'] = this.kpaSite;
        this.doc['kpa_token'] = this.kpaToken;
        this.doc['is_sync_user'] = !!this.isSyncUser;
        this.doc['is_sync_project'] = !!this.isSyncProject;
        this.doc['is_edit_user'] = !!this.isEditUser;
        this.doc['is_edit_project'] = !!this.isEditProject;
        this.doc['default_role'] = this.defaultRole;
        this.doc['is_force_reset_password'] = !!this.isForceResetPassword;
        this.doc['is_welcome_email'] = !!this.isWelcomeEmail;
        this.doc['active'] = !!this.active;

        return this.doc;
    }
}
