"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcoreUserJob = void 0;
const api_1 = require("../../../base-integration/src/api");
const model_1 = require("../../../base-integration/src/model");
const api_2 = require("../api");
const model_2 = require("../model");
const mongodb_1 = require("../mongodb");
const util_1 = require("util");
class ProcoreUserJob {
    constructor(config) {
        this.name = "Procore User Job - " + config.kpaSite;
        this.config = config;
    }
    async execute(status) {
        //Fetch KPA Users
        let kpaUserAPI = new api_1.KPAUserAPI(this.config.kpaToken);
        let kpaExistUsers = await kpaUserAPI.getAllUser();
        status.totalExistingRecord = kpaExistUsers.length;
        (0, util_1.debuglog)('log:job:user')(kpaExistUsers.toString());
        //Fetch Procore Company
        let auth = new model_2.procoreContext(this.config.procoreToken, this.config.procoreRefreshToken);
        let procoreAPI = new api_2.ProcoreAPI(auth, async (newAuth) => {
            this.config.procoreToken = newAuth.accessToken;
            this.config.procoreRefreshToken = newAuth.refreshToken;
            let db = new mongodb_1.KPAProcoreConfigurationDB();
            db.updateProcoreToken(this.config);
        });
        let companies = await procoreAPI.getCompanies();
        status.totalSourceRecord = 0;
        for (let company of companies) {
            for (let procoreCompanyId of this.config.procoreCompanyIds) {
                if (procoreCompanyId === company.id) {
                    let users = await procoreAPI.getUsers(company.id);
                    status.totalSourceRecord += users.length;
                    let kpaUsers = [];
                    for (let user of users) {
                        let isExistingKpaUser = false;
                        if (!user.is_employee) {
                            continue;
                        }
                        //Build KPA user Data and Check existing
                        var kpaUser = null;
                        for (let i = 0; i < kpaExistUsers.length; i++) {
                            const kpaExistUser = kpaExistUsers[i];
                            //Compare KPA Username with Procore user email
                            if (kpaExistUser.employeeNumber === user.employee_id) {
                                kpaUser = kpaExistUser;
                                kpaExistUsers.splice(i, 1);
                                isExistingKpaUser = true;
                                break;
                            }
                        }
                        //Build KPA user Data and Check existing
                        // todo: discuss pulling in-active users
                        if (kpaUser == null) {
                            kpaUser = new model_1.KPAUserModel();
                            if (!user.is_active) {
                                // console.log(`Skip User because of Termination Date ${user.email_address} ${user.terminationDate}`)
                                status.skippedRecord++;
                                continue;
                            }
                        }
                        else {
                            if (!this.config.isEditUser) {
                                // console.log(`Skip User because of Cannot Allow to edit ${user.email_address}`)
                                status.skippedRecord++;
                                continue;
                            }
                            if (!user.is_active) {
                                status.inactivatedRecord++;
                            }
                        }
                        kpaUser.employeeNumber = user.employee_id;
                        kpaUser.firstName = user.first_name;
                        kpaUser.lastName = user.last_name;
                        kpaUser.email = user.email_address;
                        kpaUser.username = user.email_address;
                        kpaUser.initialPassword = `KPAFlex2024!!`;
                        kpaUser.role = isExistingKpaUser ? '' : this.config.defaultRole;
                        kpaUser.title = user.job_title;
                        kpaUser.welcomeEmail = this.config.isWelcomeEmail;
                        kpaUser.resetPassword = this.config.isForceResetPassword;
                        if (!user.is_active && kpaUser.terminationDate == null) {
                            kpaUser.terminationDate = new Date().toDateString();
                        }
                        kpaUsers.push(kpaUser);
                        status.upsertRecord++;
                    }
                    //Send Data
                    // console.log(kpaUsers)
                    const success = await kpaUserAPI.saveUser(this.config.kpaSite, kpaUsers, this.config.isEditUser);
                    if (!success) {
                        throw new Error('Failed to save Users:' + this.config.kpaSite);
                    }
                }
            }
        }
    }
}
exports.ProcoreUserJob = ProcoreUserJob;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY29yZS11c2VyLWpvYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2NvcmUtaW50ZWdyYXRpb24vZnVuY3Rpb24vam9iL3Byb2NvcmUtdXNlci1qb2IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkRBQStEO0FBRS9ELCtEQUFtRTtBQUNuRSxnQ0FBb0M7QUFDcEMsb0NBQXdFO0FBQ3hFLHdDQUF1RDtBQUV2RCwrQkFBZ0M7QUFFaEMsTUFBYSxjQUFjO0lBSXZCLFlBQVksTUFBb0M7UUFDNUMsSUFBSSxDQUFDLElBQUksR0FBRyxxQkFBcUIsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ25ELElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQWlCO1FBQzNCLGlCQUFpQjtRQUNqQixJQUFJLFVBQVUsR0FBRyxJQUFJLGdCQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0RCxJQUFJLGFBQWEsR0FBRyxNQUFNLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNsRCxNQUFNLENBQUMsbUJBQW1CLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQztRQUNsRCxJQUFBLGVBQVEsRUFBQyxjQUFjLENBQUMsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUVuRCx1QkFBdUI7UUFDdkIsSUFBSSxJQUFJLEdBQUcsSUFBSSxzQkFBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUN6RixJQUFJLFVBQVUsR0FBRyxJQUFJLGdCQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRTtZQUNwRCxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsV0FBVyxD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Ly4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL2FwaVwiO1xuaW1wb3J0IHsgSUpvYiB9IGZyb20gXCIuLi8uLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy9qb2JcIjtcbmltcG9ydCB7IEtQQVVzZXJNb2RlbCB9IGZyb20gXCIuLi8uLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy9tb2RlbFwiO1xuaW1wb3J0IHsgUHJvY29yZUFQSSB9IGZyb20gXCIuLi9hcGlcIjtcbmltcG9ydCB7IEtQQVByb2NvcmVDb25maWd1cmF0aW9uTW9kZWwsIHByb2NvcmVDb250ZXh0IH0gZnJvbSBcIi4uL21vZGVsXCI7XG5pbXBvcnQgeyBLUEFQcm9jb3JlQ29uZmlndXJhdGlvbkRCIH0gZnJvbSBcIi4uL21vbmdvZGJcIjtcbmltcG9ydCB7IEpvYlN0YXR1cyB9IGZyb20gXCIuLi8uLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy9qb2JcIjtcbmltcG9ydCB7IGRlYnVnbG9nIH0gZnJvbSAndXRpbCc7XG5cbmV4cG9ydCBjbGFzcyBQcm9jb3JlVXNlckpvYiBpbXBsZW1lbnRzIElKb2Ige1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBjb25maWc6IEtQQVByb2NvcmVDb25maWd1cmF0aW9uTW9kZWw7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb25maWc6IEtQQVByb2NvcmVDb25maWd1cmF0aW9uTW9kZWwpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gXCJQcm9jb3JlIFVzZXIgSm9iIC0gXCIgKyBjb25maWcua3BhU2l0ZTtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgfVxuXG4gICAgYXN5bmMgZXhlY3V0ZShzdGF0dXM6IEpvYlN0YXR1cyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICAvL0ZldGNoIEtQQSBVc2Vyc1xuICAgICAgICBsZXQga3BhVXNlckFQSSA9IG5ldyBLUEFVc2VyQVBJKHRoaXMuY29uZmlnLmtwYVRva2VuKTtcbiAgICAgICAgbGV0IGtwYUV4aXN0VXNlcnMgPSBhd2FpdCBrcGFVc2VyQVBJLmdldEFsbFVzZXIoKTtcbiAgICAgICAgc3RhdHVzLnRvdGFsRXhpc3RpbmdSZWNvcmQgPSBrcGFFeGlzdFVzZXJzLmxlbmd0aDtcbiAgICAgICAgZGVidWdsb2coJ2xvZzpqb2I6dXNlcicpKGtwYUV4aXN0VXNlcnMudG9TdHJpbmcoKSk7XG5cbiAgICAgICAgLy9GZXRjaCBQcm9jb3JlIENvbXBhbnlcbiAgICAgICAgbGV0IGF1dGggPSBuZXcgcHJvY29yZUNvbnRleHQodGhpcy5jb25maWcucHJvY29yZVRva2VuLCB0aGlzLmNvbmZpZy5wcm9jb3JlUmVmcmVzaFRva2VuKTtcbiAgICAgICAgbGV0IHByb2NvcmVBUEkgPSBuZXcgUHJvY29yZUFQSShhdXRoLCBhc3luYyAobmV3QXV0aCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jb25maWcucHJvY29yZVRva2VuID0gbmV3QXV0aC5hY2Nlc3NUb2tlbjtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLnByb2NvcmVSZWZyZXNoVG9rZW4gPSBuZXdBdXRoLnJlZnJlc2hUb2tlbjtcblxuICAgICAgICAgICAgbGV0IGRiID0gbmV3IEtQQVByb2NvcmVDb25maWd1cmF0aW9uREIoKTtcbiAgICAgICAgICAgIGRiLnVwZGF0ZVByb2NvcmVUb2tlbih0aGlzLmNvbmZpZyk7XG4gICAgICAgIH0pXG4gICAgICAgIGxldCBjb21wYW5pZXMgPSBhd2FpdCBwcm9jb3JlQVBJLmdldENvbXBhbmllcygpO1xuICAgICAgICBzdGF0dXMudG90YWxTb3VyY2VSZWNvcmQgPSAwXG5cbiAgICAgICAgZm9yKGxldCBjb21wYW55IG9mIGNvbXBhbmllcykge1xuICAgICAgICAgICAgZm9yKGxldCBwcm9jb3JlQ29tcGFueUlkIG9mIHRoaXMuY29uZmlnLnByb2NvcmVDb21wYW55SWRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByb2NvcmVDb21wYW55SWQgPT09IGNvbXBhbnkuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHVzZXJzID0gYXdhaXQgcHJvY29yZUFQSS5nZXRVc2Vycyhjb21wYW55LmlkKTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLnRvdGFsU291cmNlUmVjb3JkICs9IHVzZXJzLmxlbmd0aFxuXG4gICAgICAgICAgICAgICAgICAgIGxldCBrcGFVc2VycyA6IEtQQVVzZXJNb2RlbFtdID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgdXNlciBvZiB1c2Vycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGlzRXhpc3RpbmdLcGFVc2VyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXVzZXIuaXNfZW1wbG95ZWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9CdWlsZCBLUEEgdXNlciBEYXRhIGFuZCBDaGVjayBleGlzdGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGtwYVVzZXIgOiBLUEFVc2VyTW9kZWwgfCBudWxsID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga3BhRXhpc3RVc2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGtwYUV4aXN0VXNlciA9IGtwYUV4aXN0VXNlcnNbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0NvbXBhcmUgS1BBIFVzZXJuYW1lIHdpdGggUHJvY29yZSB1c2VyIGVtYWlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtwYUV4aXN0VXNlci5lbXBsb3llZU51bWJlciA9PT0gdXNlci5lbXBsb3llZV9pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrcGFVc2VyID0ga3BhRXhpc3RVc2VyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrcGFFeGlzdFVzZXJzLnNwbGljZShpLDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0V4aXN0aW5nS3BhVXNlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9CdWlsZCBLUEEgdXNlciBEYXRhIGFuZCBDaGVjayBleGlzdGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdG9kbzogZGlzY3VzcyBwdWxsaW5nIGluLWFjdGl2ZSB1c2Vyc1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtwYVVzZXIgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXIgPSBuZXcgS1BBVXNlck1vZGVsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF1c2VyLmlzX2FjdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgU2tpcCBVc2VyIGJlY2F1c2Ugb2YgVGVybWluYXRpb24gRGF0ZSAke3VzZXIuZW1haWxfYWRkcmVzc30gJHt1c2VyLnRlcm1pbmF0aW9uRGF0ZX1gKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXMuc2tpcHBlZFJlY29yZCsrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5pc0VkaXRVc2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGBTa2lwIFVzZXIgYmVjYXVzZSBvZiBDYW5ub3QgQWxsb3cgdG8gZWRpdCAke3VzZXIuZW1haWxfYWRkcmVzc31gKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXMuc2tpcHBlZFJlY29yZCsrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdXNlci5pc19hY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmluYWN0aXZhdGVkUmVjb3JkKytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXIuZW1wbG95ZWVOdW1iZXIgPSB1c2VyLmVtcGxveWVlX2lkO1xuICAgICAgICAgICAgICAgICAgICAgICAga3BhVXNlci5maXJzdE5hbWUgPSB1c2VyLmZpcnN0X25hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXIubGFzdE5hbWUgPSB1c2VyLmxhc3RfbmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXIuZW1haWwgPSB1c2VyLmVtYWlsX2FkZHJlc3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBrcGFVc2VyLnVzZXJuYW1lID0gdXNlci5lbWFpbF9hZGRyZXNzO1xuICAgICAgICAgICAgICAgICAgICAgICAga3BhVXNlci5pbml0aWFsUGFzc3dvcmQgPSBgS1BBRmxleDIwMjQhIWA7XG4gICAgICAgICAgICAgICAgICAgICAgICBrcGFVc2VyLnJvbGUgPSBpc0V4aXN0aW5nS3BhVXNlciA/ICcnIDogdGhpcy5jb25maWcuZGVmYXVsdFJvbGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBrcGFVc2VyLnRpdGxlID0gdXNlci5qb2JfdGl0bGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBrcGFVc2VyLndlbGNvbWVFbWFpbCA9IHRoaXMuY29uZmlnLmlzV2VsY29tZUVtYWlsXG4gICAgICAgICAgICAgICAgICAgICAgICBrcGFVc2VyLnJlc2V0UGFzc3dvcmQgPSB0aGlzLmNvbmZpZy5pc0ZvcmNlUmVzZXRQYXNzd29yZFxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXVzZXIuaXNfYWN0aXZlICYmIGtwYVVzZXIudGVybWluYXRpb25EYXRlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrcGFVc2VyLnRlcm1pbmF0aW9uRGF0ZSA9IG5ldyBEYXRlKCkudG9EYXRlU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXJzLnB1c2goa3BhVXNlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXMudXBzZXJ0UmVjb3JkKys7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvL1NlbmQgRGF0YVxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhrcGFVc2VycylcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3VjY2VzcyA9IGF3YWl0IGtwYVVzZXJBUEkuc2F2ZVVzZXIodGhpcy5jb25maWcua3BhU2l0ZSwga3BhVXNlcnMsIHRoaXMuY29uZmlnLmlzRWRpdFVzZXIpXG4gICAgICAgICAgICAgICAgICAgIGlmICghc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gc2F2ZSBVc2VyczonICsgdGhpcy5jb25maWcua3BhU2l0ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiJdfQ==