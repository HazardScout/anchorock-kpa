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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY29yZS11c2VyLWpvYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2NvcmUtaW50ZWdyYXRpb24vZnVuY3Rpb24vam9iL3Byb2NvcmUtdXNlci1qb2IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkRBQStEO0FBRS9ELCtEQUFtRTtBQUNuRSxnQ0FBb0M7QUFDcEMsb0NBQXdFO0FBQ3hFLHdDQUF1RDtBQUV2RCwrQkFBZ0M7QUFFaEMsTUFBYSxjQUFjO0lBSXZCLFlBQVksTUFBb0M7UUFDNUMsSUFBSSxDQUFDLElBQUksR0FBRyxxQkFBcUIsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ25ELElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQWlCO1FBQzNCLGlCQUFpQjtRQUNqQixJQUFJLFVBQVUsR0FBRyxJQUFJLGdCQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0RCxJQUFJLGFBQWEsR0FBRyxNQUFNLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNsRCxNQUFNLENBQUMsbUJBQW1CLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQztRQUNsRCxJQUFBLGVBQVEsRUFBQyxjQUFjLENBQUMsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUVuRCx1QkFBdUI7UUFDdkIsSUFBSSxJQUFJLEdBQUcsSUFBSSxzQkFBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUN6RixJQUFJLFVBQVUsR0FBRyxJQUFJLGdCQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRTtZQUNwRCxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsV0FBVyxD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LFNBQVMsQ0FBQzt3QkFDL0IsT0FBTyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQTt3QkFDakQsT0FBTyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFBO3dCQUV4RCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxPQUFPLENBQUMsZUFBZSxJQUFJLElBQUksRUFBRSxDQUFDOzRCQUNyRCxPQUFPLENBQUMsZUFBZSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7d0JBQ3hELENBQUM7d0JBRUQsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzt3QkFDdkIsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO29CQUMxQixDQUFDO29CQUVELFdBQVc7b0JBQ1gsd0JBQXdCO29CQUN4QixNQUFNLE9BQU8sR0FBRyxNQUFNLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUE7b0JBQ2hHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzt3QkFDWCxNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ25FLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztDQUVKO0FBcEdELHdDQW9HQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEtQQVVzZXJBUEkgfSBmcm9tIFwiLi4vLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvYXBpXCI7XG5pbXBvcnQgeyBJSm9iIH0gZnJvbSBcIi4uLy4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL2pvYlwiO1xuaW1wb3J0IHsgS1BBVXNlck1vZGVsIH0gZnJvbSBcIi4uLy4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL21vZGVsXCI7XG5pbXBvcnQgeyBQcm9jb3JlQVBJIH0gZnJvbSBcIi4uL2FwaVwiO1xuaW1wb3J0IHsgS1BBUHJvY29yZUNvbmZpZ3VyYXRpb25Nb2RlbCwgcHJvY29yZUNvbnRleHQgfSBmcm9tIFwiLi4vbW9kZWxcIjtcbmltcG9ydCB7IEtQQVByb2NvcmVDb25maWd1cmF0aW9uREIgfSBmcm9tIFwiLi4vbW9uZ29kYlwiO1xuaW1wb3J0IHsgSm9iU3RhdHVzIH0gZnJvbSBcIi4uLy4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL2pvYlwiO1xuaW1wb3J0IHsgZGVidWdsb2cgfSBmcm9tICd1dGlsJztcblxuZXhwb3J0IGNsYXNzIFByb2NvcmVVc2VySm9iIGltcGxlbWVudHMgSUpvYiB7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGNvbmZpZzogS1BBUHJvY29yZUNvbmZpZ3VyYXRpb25Nb2RlbDtcblxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogS1BBUHJvY29yZUNvbmZpZ3VyYXRpb25Nb2RlbCkge1xuICAgICAgICB0aGlzLm5hbWUgPSBcIlByb2NvcmUgVXNlciBKb2IgLSBcIiArIGNvbmZpZy5rcGFTaXRlO1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB9XG5cbiAgICBhc3luYyBleGVjdXRlKHN0YXR1czogSm9iU3RhdHVzKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIC8vRmV0Y2ggS1BBIFVzZXJzXG4gICAgICAgIGxldCBrcGFVc2VyQVBJID0gbmV3IEtQQVVzZXJBUEkodGhpcy5jb25maWcua3BhVG9rZW4pO1xuICAgICAgICBsZXQga3BhRXhpc3RVc2VycyA9IGF3YWl0IGtwYVVzZXJBUEkuZ2V0QWxsVXNlcigpO1xuICAgICAgICBzdGF0dXMudG90YWxFeGlzdGluZ1JlY29yZCA9IGtwYUV4aXN0VXNlcnMubGVuZ3RoO1xuICAgICAgICBkZWJ1Z2xvZygnbG9nOmpvYjp1c2VyJykoa3BhRXhpc3RVc2Vycy50b1N0cmluZygpKTtcblxuICAgICAgICAvL0ZldGNoIFByb2NvcmUgQ29tcGFueVxuICAgICAgICBsZXQgYXV0aCA9IG5ldyBwcm9jb3JlQ29udGV4dCh0aGlzLmNvbmZpZy5wcm9jb3JlVG9rZW4sIHRoaXMuY29uZmlnLnByb2NvcmVSZWZyZXNoVG9rZW4pO1xuICAgICAgICBsZXQgcHJvY29yZUFQSSA9IG5ldyBQcm9jb3JlQVBJKGF1dGgsIGFzeW5jIChuZXdBdXRoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5wcm9jb3JlVG9rZW4gPSBuZXdBdXRoLmFjY2Vzc1Rva2VuO1xuICAgICAgICAgICAgdGhpcy5jb25maWcucHJvY29yZVJlZnJlc2hUb2tlbiA9IG5ld0F1dGgucmVmcmVzaFRva2VuO1xuXG4gICAgICAgICAgICBsZXQgZGIgPSBuZXcgS1BBUHJvY29yZUNvbmZpZ3VyYXRpb25EQigpO1xuICAgICAgICAgICAgZGIudXBkYXRlUHJvY29yZVRva2VuKHRoaXMuY29uZmlnKTtcbiAgICAgICAgfSlcbiAgICAgICAgbGV0IGNvbXBhbmllcyA9IGF3YWl0IHByb2NvcmVBUEkuZ2V0Q29tcGFuaWVzKCk7XG4gICAgICAgIHN0YXR1cy50b3RhbFNvdXJjZVJlY29yZCA9IDBcblxuICAgICAgICBmb3IobGV0IGNvbXBhbnkgb2YgY29tcGFuaWVzKSB7XG4gICAgICAgICAgICBmb3IobGV0IHByb2NvcmVDb21wYW55SWQgb2YgdGhpcy5jb25maWcucHJvY29yZUNvbXBhbnlJZHMpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvY29yZUNvbXBhbnlJZCA9PT0gY29tcGFueS5pZCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdXNlcnMgPSBhd2FpdCBwcm9jb3JlQVBJLmdldFVzZXJzKGNvbXBhbnkuaWQpO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMudG90YWxTb3VyY2VSZWNvcmQgKz0gdXNlcnMubGVuZ3RoXG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGtwYVVzZXJzIDogS1BBVXNlck1vZGVsW10gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCB1c2VyIG9mIHVzZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL0J1aWxkIEtQQSB1c2VyIERhdGEgYW5kIENoZWNrIGV4aXN0aW5nXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIga3BhVXNlciA6IEtQQVVzZXJNb2RlbCB8IG51bGwgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrcGFFeGlzdFVzZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qga3BhRXhpc3RVc2VyID0ga3BhRXhpc3RVc2Vyc1tpXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQ29tcGFyZSBLUEEgVXNlcm5hbWUgd2l0aCBQcm9jb3JlIHVzZXIgZW1haWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoa3BhRXhpc3RVc2VyLmVtcGxveWVlTnVtYmVyID09PSB1c2VyLmVtcGxveWVlX2lkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXIgPSBrcGFFeGlzdFVzZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtwYUV4aXN0VXNlcnMuc3BsaWNlKGksMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9CdWlsZCBLUEEgdXNlciBEYXRhIGFuZCBDaGVjayBleGlzdGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdG9kbzogZGlzY3VzcyBwdWxsaW5nIGluLWFjdGl2ZSB1c2Vyc1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtwYVVzZXIgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXIgPSBuZXcgS1BBVXNlck1vZGVsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF1c2VyLmlzX2FjdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgU2tpcCBVc2VyIGJlY2F1c2Ugb2YgVGVybWluYXRpb24gRGF0ZSAke3VzZXIuZW1haWxfYWRkcmVzc30gJHt1c2VyLnRlcm1pbmF0aW9uRGF0ZX1gKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXMuc2tpcHBlZFJlY29yZCsrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5pc0VkaXRVc2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGBTa2lwIFVzZXIgYmVjYXVzZSBvZiBDYW5ub3QgQWxsb3cgdG8gZWRpdCAke3VzZXIuZW1haWxfYWRkcmVzc31gKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXMuc2tpcHBlZFJlY29yZCsrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdXNlci5pc19hY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmluYWN0aXZhdGVkUmVjb3JkKytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXIuZW1wbG95ZWVOdW1iZXIgPSB1c2VyLmVtcGxveWVlX2lkO1xuICAgICAgICAgICAgICAgICAgICAgICAga3BhVXNlci5maXJzdE5hbWUgPSB1c2VyLmZpcnN0X25hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXIubGFzdE5hbWUgPSB1c2VyLmxhc3RfbmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXIuZW1haWwgPSB1c2VyLmVtYWlsX2FkZHJlc3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBrcGFVc2VyLnVzZXJuYW1lID0gdXNlci5lbWFpbF9hZGRyZXNzO1xuICAgICAgICAgICAgICAgICAgICAgICAga3BhVXNlci5pbml0aWFsUGFzc3dvcmQgPSBgS1BBRmxleDIwMjQhIWA7XG4gICAgICAgICAgICAgICAgICAgICAgICBrcGFVc2VyLnJvbGUgPSB0aGlzLmNvbmZpZy5kZWZhdWx0Um9sZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXIudGl0bGUgPSB1c2VyLmpvYl90aXRsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXIud2VsY29tZUVtYWlsID0gdGhpcy5jb25maWcuaXNXZWxjb21lRW1haWxcbiAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXIucmVzZXRQYXNzd29yZCA9IHRoaXMuY29uZmlnLmlzRm9yY2VSZXNldFBhc3N3b3JkXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdXNlci5pc19hY3RpdmUgJiYga3BhVXNlci50ZXJtaW5hdGlvbkRhdGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXIudGVybWluYXRpb25EYXRlID0gbmV3IERhdGUoKS50b0RhdGVTdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAga3BhVXNlcnMucHVzaChrcGFVc2VyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cy51cHNlcnRSZWNvcmQrKztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vU2VuZCBEYXRhXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGtwYVVzZXJzKVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdWNjZXNzID0gYXdhaXQga3BhVXNlckFQSS5zYXZlVXNlcih0aGlzLmNvbmZpZy5rcGFTaXRlLCBrcGFVc2VycywgdGhpcy5jb25maWcuaXNFZGl0VXNlcilcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBzYXZlIFVzZXJzOicgKyB0aGlzLmNvbmZpZy5rcGFTaXRlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufVxuIl19