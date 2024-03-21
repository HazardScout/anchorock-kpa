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
        this.name = "Procore User Job";
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
                        //Build KPA user Data and Check existing
                        var kpaUser = null;
                        for (let i = 0; i < kpaExistUsers.length; i++) {
                            const kpaExistUser = kpaExistUsers[i];
                            //Compare KPA Username with Procore user email
                            if (kpaExistUser.employeeNumber === user.employee_id) {
                                kpaUser = kpaExistUser;
                                kpaExistUsers.splice(i, 1);
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
                        kpaUser.username = user.employee_id;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY29yZS11c2VyLWpvYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2NvcmUtaW50ZWdyYXRpb24vZnVuY3Rpb24vam9iL3Byb2NvcmUtdXNlci1qb2IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkRBQStEO0FBRS9ELCtEQUFtRTtBQUNuRSxnQ0FBb0M7QUFDcEMsb0NBQXdFO0FBQ3hFLHdDQUF1RDtBQUV2RCwrQkFBZ0M7QUFFaEMsTUFBYSxjQUFjO0lBSXZCLFlBQVksTUFBb0M7UUFDNUMsSUFBSSxDQUFDLElBQUksR0FBRyxrQkFBa0IsQ0FBQztRQUMvQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN6QixDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFpQjtRQUMzQixpQkFBaUI7UUFDakIsSUFBSSxVQUFVLEdBQUcsSUFBSSxnQkFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdEQsSUFBSSxhQUFhLEdBQUcsTUFBTSxVQUFVLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEQsTUFBTSxDQUFDLG1CQUFtQixHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUM7UUFDbEQsSUFBQSxlQUFRLEVBQUMsY0FBYyxDQUFDLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFFbkQsdUJBQXVCO1FBQ3ZCLElBQUksSUFBSSxHQUFHLElBQUksc0JBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDekYsSUFBSSxVQUFVLEdBQUcsSUFBSSxnQkFBVSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUU7WUFDcEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQztZQUMvQyxJQUFJLENBQUMs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QU8sQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUE7d0JBQ2pELE9BQU8sQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQTt3QkFFeEQsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksT0FBTyxDQUFDLGVBQWUsSUFBSSxJQUFJLEVBQUUsQ0FBQzs0QkFDckQsT0FBTyxDQUFDLGVBQWUsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO3dCQUN4RCxDQUFDO3dCQUVELFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBQ3ZCLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztvQkFDMUIsQ0FBQztvQkFFRCxXQUFXO29CQUNYLHdCQUF3QjtvQkFDeEIsTUFBTSxPQUFPLEdBQUcsTUFBTSxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFBO29CQUNoRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBQ1gsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNuRSxDQUFDO2dCQUNMLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7Q0FFSjtBQXBHRCx3Q0FvR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBLUEFVc2VyQVBJIH0gZnJvbSBcIi4uLy4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL2FwaVwiO1xuaW1wb3J0IHsgSUpvYiB9IGZyb20gXCIuLi8uLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy9qb2JcIjtcbmltcG9ydCB7IEtQQVVzZXJNb2RlbCB9IGZyb20gXCIuLi8uLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy9tb2RlbFwiO1xuaW1wb3J0IHsgUHJvY29yZUFQSSB9IGZyb20gXCIuLi9hcGlcIjtcbmltcG9ydCB7IEtQQVByb2NvcmVDb25maWd1cmF0aW9uTW9kZWwsIHByb2NvcmVDb250ZXh0IH0gZnJvbSBcIi4uL21vZGVsXCI7XG5pbXBvcnQgeyBLUEFQcm9jb3JlQ29uZmlndXJhdGlvbkRCIH0gZnJvbSBcIi4uL21vbmdvZGJcIjtcbmltcG9ydCB7IEpvYlN0YXR1cyB9IGZyb20gXCIuLi8uLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy9qb2JcIjtcbmltcG9ydCB7IGRlYnVnbG9nIH0gZnJvbSAndXRpbCc7XG5cbmV4cG9ydCBjbGFzcyBQcm9jb3JlVXNlckpvYiBpbXBsZW1lbnRzIElKb2Ige1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBjb25maWc6IEtQQVByb2NvcmVDb25maWd1cmF0aW9uTW9kZWw7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb25maWc6IEtQQVByb2NvcmVDb25maWd1cmF0aW9uTW9kZWwpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gXCJQcm9jb3JlIFVzZXIgSm9iXCI7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIH1cblxuICAgIGFzeW5jIGV4ZWN1dGUoc3RhdHVzOiBKb2JTdGF0dXMpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgLy9GZXRjaCBLUEEgVXNlcnNcbiAgICAgICAgbGV0IGtwYVVzZXJBUEkgPSBuZXcgS1BBVXNlckFQSSh0aGlzLmNvbmZpZy5rcGFUb2tlbik7XG4gICAgICAgIGxldCBrcGFFeGlzdFVzZXJzID0gYXdhaXQga3BhVXNlckFQSS5nZXRBbGxVc2VyKCk7XG4gICAgICAgIHN0YXR1cy50b3RhbEV4aXN0aW5nUmVjb3JkID0ga3BhRXhpc3RVc2Vycy5sZW5ndGg7XG4gICAgICAgIGRlYnVnbG9nKCdsb2c6am9iOnVzZXInKShrcGFFeGlzdFVzZXJzLnRvU3RyaW5nKCkpO1xuXG4gICAgICAgIC8vRmV0Y2ggUHJvY29yZSBDb21wYW55XG4gICAgICAgIGxldCBhdXRoID0gbmV3IHByb2NvcmVDb250ZXh0KHRoaXMuY29uZmlnLnByb2NvcmVUb2tlbiwgdGhpcy5jb25maWcucHJvY29yZVJlZnJlc2hUb2tlbik7XG4gICAgICAgIGxldCBwcm9jb3JlQVBJID0gbmV3IFByb2NvcmVBUEkoYXV0aCwgYXN5bmMgKG5ld0F1dGgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLnByb2NvcmVUb2tlbiA9IG5ld0F1dGguYWNjZXNzVG9rZW47XG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5wcm9jb3JlUmVmcmVzaFRva2VuID0gbmV3QXV0aC5yZWZyZXNoVG9rZW47XG5cbiAgICAgICAgICAgIGxldCBkYiA9IG5ldyBLUEFQcm9jb3JlQ29uZmlndXJhdGlvbkRCKCk7XG4gICAgICAgICAgICBkYi51cGRhdGVQcm9jb3JlVG9rZW4odGhpcy5jb25maWcpO1xuICAgICAgICB9KVxuICAgICAgICBsZXQgY29tcGFuaWVzID0gYXdhaXQgcHJvY29yZUFQSS5nZXRDb21wYW5pZXMoKTtcbiAgICAgICAgc3RhdHVzLnRvdGFsU291cmNlUmVjb3JkID0gMFxuXG4gICAgICAgIGZvcihsZXQgY29tcGFueSBvZiBjb21wYW5pZXMpIHtcbiAgICAgICAgICAgIGZvcihsZXQgcHJvY29yZUNvbXBhbnlJZCBvZiB0aGlzLmNvbmZpZy5wcm9jb3JlQ29tcGFueUlkcykge1xuICAgICAgICAgICAgICAgIGlmIChwcm9jb3JlQ29tcGFueUlkID09PSBjb21wYW55LmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB1c2VycyA9IGF3YWl0IHByb2NvcmVBUEkuZ2V0VXNlcnMoY29tcGFueS5pZCk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy50b3RhbFNvdXJjZVJlY29yZCArPSB1c2Vycy5sZW5ndGhcblxuICAgICAgICAgICAgICAgICAgICBsZXQga3BhVXNlcnMgOiBLUEFVc2VyTW9kZWxbXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHVzZXIgb2YgdXNlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vQnVpbGQgS1BBIHVzZXIgRGF0YSBhbmQgQ2hlY2sgZXhpc3RpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBrcGFVc2VyIDogS1BBVXNlck1vZGVsIHwgbnVsbCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtwYUV4aXN0VXNlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrcGFFeGlzdFVzZXIgPSBrcGFFeGlzdFVzZXJzW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9Db21wYXJlIEtQQSBVc2VybmFtZSB3aXRoIFByb2NvcmUgdXNlciBlbWFpbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrcGFFeGlzdFVzZXIuZW1wbG95ZWVOdW1iZXIgPT09IHVzZXIuZW1wbG95ZWVfaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga3BhVXNlciA9IGtwYUV4aXN0VXNlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga3BhRXhpc3RVc2Vycy5zcGxpY2UoaSwxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL0J1aWxkIEtQQSB1c2VyIERhdGEgYW5kIENoZWNrIGV4aXN0aW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0b2RvOiBkaXNjdXNzIHB1bGxpbmcgaW4tYWN0aXZlIHVzZXJzXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoa3BhVXNlciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga3BhVXNlciA9IG5ldyBLUEFVc2VyTW9kZWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXVzZXIuaXNfYWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGBTa2lwIFVzZXIgYmVjYXVzZSBvZiBUZXJtaW5hdGlvbiBEYXRlICR7dXNlci5lbWFpbF9hZGRyZXNzfSAke3VzZXIudGVybWluYXRpb25EYXRlfWApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cy5za2lwcGVkUmVjb3JkKytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY29uZmlnLmlzRWRpdFVzZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYFNraXAgVXNlciBiZWNhdXNlIG9mIENhbm5vdCBBbGxvdyB0byBlZGl0ICR7dXNlci5lbWFpbF9hZGRyZXNzfWApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cy5za2lwcGVkUmVjb3JkKytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF1c2VyLmlzX2FjdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXMuaW5hY3RpdmF0ZWRSZWNvcmQrK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAga3BhVXNlci5lbXBsb3llZU51bWJlciA9IHVzZXIuZW1wbG95ZWVfaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBrcGFVc2VyLmZpcnN0TmFtZSA9IHVzZXIuZmlyc3RfbmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAga3BhVXNlci5sYXN0TmFtZSA9IHVzZXIubGFzdF9uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAga3BhVXNlci5lbWFpbCA9IHVzZXIuZW1haWxfYWRkcmVzcztcbiAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXIudXNlcm5hbWUgPSB1c2VyLmVtcGxveWVlX2lkO1xuICAgICAgICAgICAgICAgICAgICAgICAga3BhVXNlci5pbml0aWFsUGFzc3dvcmQgPSBgS1BBRmxleDIwMjQhIWA7XG4gICAgICAgICAgICAgICAgICAgICAgICBrcGFVc2VyLnJvbGUgPSB0aGlzLmNvbmZpZy5kZWZhdWx0Um9sZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXIudGl0bGUgPSB1c2VyLmpvYl90aXRsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXIud2VsY29tZUVtYWlsID0gdGhpcy5jb25maWcuaXNXZWxjb21lRW1haWxcbiAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXIucmVzZXRQYXNzd29yZCA9IHRoaXMuY29uZmlnLmlzRm9yY2VSZXNldFBhc3N3b3JkXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdXNlci5pc19hY3RpdmUgJiYga3BhVXNlci50ZXJtaW5hdGlvbkRhdGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXIudGVybWluYXRpb25EYXRlID0gbmV3IERhdGUoKS50b0RhdGVTdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAga3BhVXNlcnMucHVzaChrcGFVc2VyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cy51cHNlcnRSZWNvcmQrKztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vU2VuZCBEYXRhXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGtwYVVzZXJzKVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdWNjZXNzID0gYXdhaXQga3BhVXNlckFQSS5zYXZlVXNlcih0aGlzLmNvbmZpZy5rcGFTaXRlLCBrcGFVc2VycywgdGhpcy5jb25maWcuaXNFZGl0VXNlcilcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBzYXZlIFVzZXJzOicgKyB0aGlzLmNvbmZpZy5rcGFTaXRlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufVxuIl19