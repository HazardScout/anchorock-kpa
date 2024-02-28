"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcoreUserJob = void 0;
const api_1 = require("../../../base-integration/src/api");
const model_1 = require("../../../base-integration/src/model");
const api_2 = require("../api");
const model_2 = require("../model");
const mongodb_1 = require("../mongodb");
class ProcoreUserJob {
    constructor(config) {
        this.name = "Procore User Job";
        this.config = config;
    }
    async execute(status) {
        try {
            //Fetch KPA Users
            let kpaUserAPI = new api_1.KPAUserAPI(this.config.kpaToken);
            let kpaExistUsers = await kpaUserAPI.getAllUser();
            status.totalExistingRecord = kpaExistUsers.length;
            console.log(kpaExistUsers);
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
                for (let procoreCompany of this.config.procoreCompanies) {
                    if (procoreCompany === company.name) {
                        let users = await procoreAPI.getUsers(company.id);
                        status.totalSourceRecord += users.length;
                        let kpaUsers = [];
                        for (let user of users) {
                            if (user.employee_id == null || user.employee_id == '') {
                                status.skippedRecord++;
                                continue;
                            }
                            if (user.email_address == null || user.email_address == '') {
                                status.skippedRecord++;
                                continue;
                            }
                            //Build KPA user Data and Check existing
                            var kpaUser = null;
                            for (let i = 0; i < kpaExistUsers.length; i++) {
                                const kpaExistUser = kpaExistUsers[i];
                                //Compare KPA Username with Procore user email
                                if (kpaExistUser.username === user.email_address) {
                                    kpaUser = kpaExistUser;
                                    kpaExistUsers.splice(i, 1);
                                    break;
                                }
                            }
                            //Build KPA user Data and Check existing
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
                            kpaUser.role = this.config.defaultRole;
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
                        const success = await kpaUserAPI.saveUser(this.config.kpaSite, kpaUsers);
                        if (!success) {
                            console.log('Failed to save Users');
                        }
                    }
                }
            }
        }
        catch (e) {
            console.log('Worker Stop with Error : ' + String(e));
            //Send an email to failed;
        }
    }
}
exports.ProcoreUserJob = ProcoreUserJob;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY29yZS11c2VyLWpvYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2NvcmUtaW50ZWdyYXRpb24vZnVuY3Rpb24vam9iL3Byb2NvcmUtdXNlci1qb2IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkRBQStEO0FBRS9ELCtEQUFtRTtBQUNuRSxnQ0FBb0M7QUFDcEMsb0NBQXdFO0FBQ3hFLHdDQUF1RDtBQUd2RCxNQUFhLGNBQWM7SUFJdkIsWUFBWSxNQUFvQztRQUM1QyxJQUFJLENBQUMsSUFBSSxHQUFHLGtCQUFrQixDQUFDO1FBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQWlCO1FBQzNCLElBQUksQ0FBQztZQUNELGlCQUFpQjtZQUNqQixJQUFJLFVBQVUsR0FBRyxJQUFJLGdCQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0RCxJQUFJLGFBQWEsR0FBRyxNQUFNLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNsRCxNQUFNLENBQUMsbUJBQW1CLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQztZQUNsRCxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFBO1lBRTFCLHVCQUF1QjtZQUN2QixJQUFJLElBQUksR0FBRyxJQUFJLHNCQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQ3pGLElBQUksVUFBVSxHQUFHLElBQUksZ0JBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFO2dCQUNwRCxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO2dCQUMvQyxJQUFJLENBQUMsTUFBTSxDQUFDLG1CQUFtQixHQUFH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O1lBQ2xELDBCQUEwQjtRQUM5QixDQUFDO0lBQ0wsQ0FBQztDQUVKO0FBbEhELHdDQWtIQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEtQQVVzZXJBUEkgfSBmcm9tIFwiLi4vLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvYXBpXCI7XG5pbXBvcnQgeyBJSm9iIH0gZnJvbSBcIi4uLy4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL2pvYlwiO1xuaW1wb3J0IHsgS1BBVXNlck1vZGVsIH0gZnJvbSBcIi4uLy4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL21vZGVsXCI7XG5pbXBvcnQgeyBQcm9jb3JlQVBJIH0gZnJvbSBcIi4uL2FwaVwiO1xuaW1wb3J0IHsgS1BBUHJvY29yZUNvbmZpZ3VyYXRpb25Nb2RlbCwgcHJvY29yZUNvbnRleHQgfSBmcm9tIFwiLi4vbW9kZWxcIjtcbmltcG9ydCB7IEtQQVByb2NvcmVDb25maWd1cmF0aW9uREIgfSBmcm9tIFwiLi4vbW9uZ29kYlwiO1xuaW1wb3J0IHsgSm9iU3RhdHVzIH0gZnJvbSBcIi4uLy4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL2pvYlwiO1xuXG5leHBvcnQgY2xhc3MgUHJvY29yZVVzZXJKb2IgaW1wbGVtZW50cyBJSm9iIHtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgY29uZmlnOiBLUEFQcm9jb3JlQ29uZmlndXJhdGlvbk1vZGVsO1xuXG4gICAgY29uc3RydWN0b3IoY29uZmlnOiBLUEFQcm9jb3JlQ29uZmlndXJhdGlvbk1vZGVsKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IFwiUHJvY29yZSBVc2VyIEpvYlwiO1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB9XG5cbiAgICBhc3luYyBleGVjdXRlKHN0YXR1czogSm9iU3RhdHVzKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvL0ZldGNoIEtQQSBVc2Vyc1xuICAgICAgICAgICAgbGV0IGtwYVVzZXJBUEkgPSBuZXcgS1BBVXNlckFQSSh0aGlzLmNvbmZpZy5rcGFUb2tlbik7XG4gICAgICAgICAgICBsZXQga3BhRXhpc3RVc2VycyA9IGF3YWl0IGtwYVVzZXJBUEkuZ2V0QWxsVXNlcigpO1xuICAgICAgICAgICAgc3RhdHVzLnRvdGFsRXhpc3RpbmdSZWNvcmQgPSBrcGFFeGlzdFVzZXJzLmxlbmd0aDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGtwYUV4aXN0VXNlcnMpXG5cbiAgICAgICAgICAgIC8vRmV0Y2ggUHJvY29yZSBDb21wYW55XG4gICAgICAgICAgICBsZXQgYXV0aCA9IG5ldyBwcm9jb3JlQ29udGV4dCh0aGlzLmNvbmZpZy5wcm9jb3JlVG9rZW4sIHRoaXMuY29uZmlnLnByb2NvcmVSZWZyZXNoVG9rZW4pO1xuICAgICAgICAgICAgbGV0IHByb2NvcmVBUEkgPSBuZXcgUHJvY29yZUFQSShhdXRoLCBhc3luYyAobmV3QXV0aCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLnByb2NvcmVUb2tlbiA9IG5ld0F1dGguYWNjZXNzVG9rZW47XG4gICAgICAgICAgICAgICAgdGhpcy5jb25maWcucHJvY29yZVJlZnJlc2hUb2tlbiA9IG5ld0F1dGgucmVmcmVzaFRva2VuO1xuXG4gICAgICAgICAgICAgICAgbGV0IGRiID0gbmV3IEtQQVByb2NvcmVDb25maWd1cmF0aW9uREIoKTtcbiAgICAgICAgICAgICAgICBkYi51cGRhdGVQcm9jb3JlVG9rZW4odGhpcy5jb25maWcpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGxldCBjb21wYW5pZXMgPSBhd2FpdCBwcm9jb3JlQVBJLmdldENvbXBhbmllcygpO1xuICAgICAgICAgICAgc3RhdHVzLnRvdGFsU291cmNlUmVjb3JkID0gMFxuXG4gICAgICAgICAgICBmb3IobGV0IGNvbXBhbnkgb2YgY29tcGFuaWVzKSB7XG4gICAgICAgICAgICAgICAgZm9yKGxldCBwcm9jb3JlQ29tcGFueSBvZiB0aGlzLmNvbmZpZy5wcm9jb3JlQ29tcGFuaWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9jb3JlQ29tcGFueSA9PT0gY29tcGFueS5uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdXNlcnMgPSBhd2FpdCBwcm9jb3JlQVBJLmdldFVzZXJzKGNvbXBhbnkuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzLnRvdGFsU291cmNlUmVjb3JkICs9IHVzZXJzLmxlbmd0aFxuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQga3BhVXNlcnMgOiBLUEFVc2VyTW9kZWxbXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCB1c2VyIG9mIHVzZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVzZXIuZW1wbG95ZWVfaWQgPT0gbnVsbCB8fCB1c2VyLmVtcGxveWVlX2lkID09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cy5za2lwcGVkUmVjb3JkKytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVzZXIuZW1haWxfYWRkcmVzcyA9PSBudWxsIHx8IHVzZXIuZW1haWxfYWRkcmVzcyA9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXMuc2tpcHBlZFJlY29yZCsrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQnVpbGQgS1BBIHVzZXIgRGF0YSBhbmQgQ2hlY2sgZXhpc3RpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIga3BhVXNlciA6IEtQQVVzZXJNb2RlbCB8IG51bGwgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga3BhRXhpc3RVc2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrcGFFeGlzdFVzZXIgPSBrcGFFeGlzdFVzZXJzW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQ29tcGFyZSBLUEEgVXNlcm5hbWUgd2l0aCBQcm9jb3JlIHVzZXIgZW1haWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtwYUV4aXN0VXNlci51c2VybmFtZSA9PT0gdXNlci5lbWFpbF9hZGRyZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrcGFVc2VyID0ga3BhRXhpc3RVc2VyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga3BhRXhpc3RVc2Vycy5zcGxpY2UoaSwxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9CdWlsZCBLUEEgdXNlciBEYXRhIGFuZCBDaGVjayBleGlzdGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrcGFVc2VyID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga3BhVXNlciA9IG5ldyBLUEFVc2VyTW9kZWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF1c2VyLmlzX2FjdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYFNraXAgVXNlciBiZWNhdXNlIG9mIFRlcm1pbmF0aW9uIERhdGUgJHt1c2VyLmVtYWlsX2FkZHJlc3N9ICR7dXNlci50ZXJtaW5hdGlvbkRhdGV9YClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cy5za2lwcGVkUmVjb3JkKytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5pc0VkaXRVc2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgU2tpcCBVc2VyIGJlY2F1c2Ugb2YgQ2Fubm90IEFsbG93IHRvIGVkaXQgJHt1c2VyLmVtYWlsX2FkZHJlc3N9YClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cy5za2lwcGVkUmVjb3JkKytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF1c2VyLmlzX2FjdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmluYWN0aXZhdGVkUmVjb3JkKytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXIuZW1wbG95ZWVOdW1iZXIgPSB1c2VyLmVtcGxveWVlX2lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXIuZmlyc3ROYW1lID0gdXNlci5maXJzdF9uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga3BhVXNlci5sYXN0TmFtZSA9IHVzZXIubGFzdF9uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXIuZW1haWwgPSB1c2VyLmVtYWlsX2FkZHJlc3M7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga3BhVXNlci51c2VybmFtZSA9IHVzZXIuZW1haWxfYWRkcmVzcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrcGFVc2VyLmluaXRpYWxQYXNzd29yZCA9IGBLUEFGbGV4MjAyNCEhYDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrcGFVc2VyLnJvbGUgPSB0aGlzLmNvbmZpZy5kZWZhdWx0Um9sZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrcGFVc2VyLnRpdGxlID0gdXNlci5qb2JfdGl0bGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga3BhVXNlci53ZWxjb21lRW1haWwgPSB0aGlzLmNvbmZpZy5pc1dlbGNvbWVFbWFpbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXIucmVzZXRQYXNzd29yZCA9IHRoaXMuY29uZmlnLmlzRm9yY2VSZXNldFBhc3N3b3JkXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXVzZXIuaXNfYWN0aXZlICYmIGtwYVVzZXIudGVybWluYXRpb25EYXRlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga3BhVXNlci50ZXJtaW5hdGlvbkRhdGUgPSBuZXcgRGF0ZSgpLnRvRGF0ZVN0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXJzLnB1c2goa3BhVXNlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzLnVwc2VydFJlY29yZCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL1NlbmQgRGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coa3BhVXNlcnMpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzdWNjZXNzID0gYXdhaXQga3BhVXNlckFQSS5zYXZlVXNlcih0aGlzLmNvbmZpZy5rcGFTaXRlLCBrcGFVc2VycylcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gc2F2ZSBVc2VycycpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1dvcmtlciBTdG9wIHdpdGggRXJyb3IgOiAnK1N0cmluZyhlKSlcbiAgICAgICAgICAgIC8vU2VuZCBhbiBlbWFpbCB0byBmYWlsZWQ7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiJdfQ==