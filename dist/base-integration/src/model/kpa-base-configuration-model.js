"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KPABaseConfigurationModel = void 0;
class KPABaseConfigurationModel {
    constructor(document) {
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
    }
    syncChanges() {
        this.doc['kpa_site'] = this.kpaSite;
        this.doc['kpa_token'] = this.kpaToken;
        this.doc['is_sync_user'] = !!this.isSyncUser;
        this.doc['is_sync_project'] = !!this.isSyncProject;
        this.doc['is_edit_user'] = !!this.isEditUser;
        this.doc['is_edit_project'] = !!this.isEditProject;
        this.doc['default_role'] = this.defaultRole;
        this.doc['is_force_reset_password'] = !!this.isForceResetPassword;
        this.doc['is_welcome_email'] = !!this.isWelcomeEmail;
        return this.doc;
    }
}
exports.KPABaseConfigurationModel = KPABaseConfigurationModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3BhLWJhc2UtY29uZmlndXJhdGlvbi1tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL21vZGVsL2twYS1iYXNlLWNvbmZpZ3VyYXRpb24tbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsTUFBc0IseUJBQXlCO0lBWTNDLFlBQVksUUFBbUI7UUFDM0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLElBQUksRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQ2xFLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUNwQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDdEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUM3QyxJQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDbkQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUM3QyxJQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDbkQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQzVDLElBQUksQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDO1FBQ2xFLElBQUksQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztRQUVyRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDcEIsQ0FBQztDQUNKO0FBdENELDhEQXNDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERvY3VtZW50IH0gZnJvbSBcIm1vbmdvZGJcIjtcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEtQQUJhc2VDb25maWd1cmF0aW9uTW9kZWwge1xuICAgIHByb3RlY3RlZCBkb2M6IERvY3VtZW50O1xuICAgIGtwYVNpdGU6IHN0cmluZztcbiAgICBrcGFUb2tlbjogc3RyaW5nO1xuICAgIGlzU3luY1VzZXIgOiBib29sZWFuO1xuICAgIGlzU3luY1Byb2plY3QgOiBib29sZWFuO1xuICAgIGlzRWRpdFVzZXIgOiBib29sZWFuO1xuICAgIGlzRWRpdFByb2plY3QgOiBib29sZWFuO1xuICAgIGRlZmF1bHRSb2xlIDogc3RyaW5nO1xuICAgIGlzRm9yY2VSZXNldFBhc3N3b3JkIDogYm9vbGVhbjtcbiAgICBpc1dlbGNvbWVFbWFpbCA6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3Rvcihkb2N1bWVudD86IERvY3VtZW50KSB7XG4gICAgICAgIHRoaXMuZG9jID0gZG9jdW1lbnQgfHwge307XG4gICAgICAgIHRoaXMua3BhU2l0ZSA9IHRoaXMuZG9jWydrcGFfc2l0ZSddO1xuICAgICAgICB0aGlzLmtwYVRva2VuID0gdGhpcy5kb2NbJ2twYV90b2tlbiddO1xuICAgICAgICB0aGlzLmlzU3luY1VzZXIgPSAhIXRoaXMuZG9jWydpc19zeW5jX3VzZXInXTtcbiAgICAgICAgdGhpcy5pc1N5bmNQcm9qZWN0ID0gISF0aGlzLmRvY1snaXNfc3luY19wcm9qZWN0J107XG4gICAgICAgIHRoaXMuaXNFZGl0VXNlciA9ICEhdGhpcy5kb2NbJ2lzX2VkaXRfdXNlciddO1xuICAgICAgICB0aGlzLmlzRWRpdFByb2plY3QgPSAhIXRoaXMuZG9jWydpc19lZGl0X3Byb2plY3QnXTtcbiAgICAgICAgdGhpcy5kZWZhdWx0Um9sZSA9IHRoaXMuZG9jWydkZWZhdWx0X3JvbGUnXTtcbiAgICAgICAgdGhpcy5pc0ZvcmNlUmVzZXRQYXNzd29yZCA9ICEhdGhpcy5kb2NbJ2lzX2ZvcmNlX3Jlc2V0X3Bhc3N3b3JkJ107XG4gICAgICAgIHRoaXMuaXNXZWxjb21lRW1haWwgPSAhIXRoaXMuZG9jWydpc193ZWxjb21lX2VtYWlsJ107XG4gICAgfVxuXG4gICAgc3luY0NoYW5nZXMoKTpEb2N1bWVudCB7XG4gICAgICAgIHRoaXMuZG9jWydrcGFfc2l0ZSddID0gdGhpcy5rcGFTaXRlO1xuICAgICAgICB0aGlzLmRvY1sna3BhX3Rva2VuJ10gPSB0aGlzLmtwYVRva2VuO1xuICAgICAgICB0aGlzLmRvY1snaXNfc3luY191c2VyJ10gPSAhIXRoaXMuaXNTeW5jVXNlcjtcbiAgICAgICAgdGhpcy5kb2NbJ2lzX3N5bmNfcHJvamVjdCddID0gISF0aGlzLmlzU3luY1Byb2plY3Q7XG4gICAgICAgIHRoaXMuZG9jWydpc19lZGl0X3VzZXInXSA9ICEhdGhpcy5pc0VkaXRVc2VyO1xuICAgICAgICB0aGlzLmRvY1snaXNfZWRpdF9wcm9qZWN0J10gPSAhIXRoaXMuaXNFZGl0UHJvamVjdDtcbiAgICAgICAgdGhpcy5kb2NbJ2RlZmF1bHRfcm9sZSddID0gdGhpcy5kZWZhdWx0Um9sZTtcbiAgICAgICAgdGhpcy5kb2NbJ2lzX2ZvcmNlX3Jlc2V0X3Bhc3N3b3JkJ10gPSAhIXRoaXMuaXNGb3JjZVJlc2V0UGFzc3dvcmQ7XG4gICAgICAgIHRoaXMuZG9jWydpc193ZWxjb21lX2VtYWlsJ10gPSAhIXRoaXMuaXNXZWxjb21lRW1haWw7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZG9jO1xuICAgIH1cbn1cbiJdfQ==