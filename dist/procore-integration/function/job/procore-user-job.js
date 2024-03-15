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
            for (let procoreCompanyId of this.config.procoreCompanyIds) {
                if (procoreCompanyId === company.id) {
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
}
exports.ProcoreUserJob = ProcoreUserJob;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY29yZS11c2VyLWpvYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2NvcmUtaW50ZWdyYXRpb24vZnVuY3Rpb24vam9iL3Byb2NvcmUtdXNlci1qb2IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkRBQStEO0FBRS9ELCtEQUFtRTtBQUNuRSxnQ0FBb0M7QUFDcEMsb0NBQXdFO0FBQ3hFLHdDQUF1RDtBQUd2RCxNQUFhLGNBQWM7SUFJdkIsWUFBWSxNQUFvQztRQUM1QyxJQUFJLENBQUMsSUFBSSxHQUFHLGtCQUFrQixDQUFDO1FBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQWlCO1FBQzNCLGlCQUFpQjtRQUNqQixJQUFJLFVBQVUsR0FBRyxJQUFJLGdCQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0RCxJQUFJLGFBQWEsR0FBRyxNQUFNLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNsRCxNQUFNLENBQUMsbUJBQW1CLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQztRQUNsRCxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFBO1FBRTFCLHVCQUF1QjtRQUN2QixJQUFJLElBQUksR0FBRyxJQUFJLHNCQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3pGLElBQUksVUFBVSxHQUFHLElBQUksZ0JBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFO1lBQ3BELElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7WUFDL0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsR0FBRyxPQUFPLENBQUMsWUFBWSxD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QUMsYUFBYSxDQUFDO3dCQUNuQyxPQUFPLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7d0JBQ3RDLE9BQU8sQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO3dCQUMxQyxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO3dCQUN2QyxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7d0JBQy9CLE9BQU8sQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUE7d0JBQ2pELE9BQU8sQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQTt3QkFFeEQsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksT0FBTyxDQUFDLGVBQWUsSUFBSSxJQUFJLEVBQUUsQ0FBQzs0QkFDckQsT0FBTyxDQUFDLGVBQWUsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO3dCQUN4RCxDQUFDO3dCQUVELFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBQ3ZCLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztvQkFDMUIsQ0FBQztvQkFFRCxXQUFXO29CQUNYLHdCQUF3QjtvQkFDeEIsTUFBTSxPQUFPLEdBQUcsTUFBTSxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFBO29CQUN4RSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBO29CQUN2QyxDQUFDO2dCQUNMLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7Q0FFSjtBQTdHRCx3Q0E2R0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBLUEFVc2VyQVBJIH0gZnJvbSBcIi4uLy4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL2FwaVwiO1xuaW1wb3J0IHsgSUpvYiB9IGZyb20gXCIuLi8uLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy9qb2JcIjtcbmltcG9ydCB7IEtQQVVzZXJNb2RlbCB9IGZyb20gXCIuLi8uLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy9tb2RlbFwiO1xuaW1wb3J0IHsgUHJvY29yZUFQSSB9IGZyb20gXCIuLi9hcGlcIjtcbmltcG9ydCB7IEtQQVByb2NvcmVDb25maWd1cmF0aW9uTW9kZWwsIHByb2NvcmVDb250ZXh0IH0gZnJvbSBcIi4uL21vZGVsXCI7XG5pbXBvcnQgeyBLUEFQcm9jb3JlQ29uZmlndXJhdGlvbkRCIH0gZnJvbSBcIi4uL21vbmdvZGJcIjtcbmltcG9ydCB7IEpvYlN0YXR1cyB9IGZyb20gXCIuLi8uLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy9qb2JcIjtcblxuZXhwb3J0IGNsYXNzIFByb2NvcmVVc2VySm9iIGltcGxlbWVudHMgSUpvYiB7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGNvbmZpZzogS1BBUHJvY29yZUNvbmZpZ3VyYXRpb25Nb2RlbDtcblxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogS1BBUHJvY29yZUNvbmZpZ3VyYXRpb25Nb2RlbCkge1xuICAgICAgICB0aGlzLm5hbWUgPSBcIlByb2NvcmUgVXNlciBKb2JcIjtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgfVxuXG4gICAgYXN5bmMgZXhlY3V0ZShzdGF0dXM6IEpvYlN0YXR1cyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICAvL0ZldGNoIEtQQSBVc2Vyc1xuICAgICAgICBsZXQga3BhVXNlckFQSSA9IG5ldyBLUEFVc2VyQVBJKHRoaXMuY29uZmlnLmtwYVRva2VuKTtcbiAgICAgICAgbGV0IGtwYUV4aXN0VXNlcnMgPSBhd2FpdCBrcGFVc2VyQVBJLmdldEFsbFVzZXIoKTtcbiAgICAgICAgc3RhdHVzLnRvdGFsRXhpc3RpbmdSZWNvcmQgPSBrcGFFeGlzdFVzZXJzLmxlbmd0aDtcbiAgICAgICAgY29uc29sZS5sb2coa3BhRXhpc3RVc2VycylcblxuICAgICAgICAvL0ZldGNoIFByb2NvcmUgQ29tcGFueVxuICAgICAgICBsZXQgYXV0aCA9IG5ldyBwcm9jb3JlQ29udGV4dCh0aGlzLmNvbmZpZy5wcm9jb3JlVG9rZW4sIHRoaXMuY29uZmlnLnByb2NvcmVSZWZyZXNoVG9rZW4pO1xuICAgICAgICBsZXQgcHJvY29yZUFQSSA9IG5ldyBQcm9jb3JlQVBJKGF1dGgsIGFzeW5jIChuZXdBdXRoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5wcm9jb3JlVG9rZW4gPSBuZXdBdXRoLmFjY2Vzc1Rva2VuO1xuICAgICAgICAgICAgdGhpcy5jb25maWcucHJvY29yZVJlZnJlc2hUb2tlbiA9IG5ld0F1dGgucmVmcmVzaFRva2VuO1xuXG4gICAgICAgICAgICBsZXQgZGIgPSBuZXcgS1BBUHJvY29yZUNvbmZpZ3VyYXRpb25EQigpO1xuICAgICAgICAgICAgZGIudXBkYXRlUHJvY29yZVRva2VuKHRoaXMuY29uZmlnKTtcbiAgICAgICAgfSlcbiAgICAgICAgbGV0IGNvbXBhbmllcyA9IGF3YWl0IHByb2NvcmVBUEkuZ2V0Q29tcGFuaWVzKCk7XG4gICAgICAgIHN0YXR1cy50b3RhbFNvdXJjZVJlY29yZCA9IDBcblxuICAgICAgICBmb3IobGV0IGNvbXBhbnkgb2YgY29tcGFuaWVzKSB7XG4gICAgICAgICAgICBmb3IobGV0IHByb2NvcmVDb21wYW55SWQgb2YgdGhpcy5jb25maWcucHJvY29yZUNvbXBhbnlJZHMpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvY29yZUNvbXBhbnlJZCA9PT0gY29tcGFueS5pZCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdXNlcnMgPSBhd2FpdCBwcm9jb3JlQVBJLmdldFVzZXJzKGNvbXBhbnkuaWQpO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMudG90YWxTb3VyY2VSZWNvcmQgKz0gdXNlcnMubGVuZ3RoXG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGtwYVVzZXJzIDogS1BBVXNlck1vZGVsW10gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCB1c2VyIG9mIHVzZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodXNlci5lbXBsb3llZV9pZCA9PSBudWxsIHx8IHVzZXIuZW1wbG95ZWVfaWQgPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXMuc2tpcHBlZFJlY29yZCsrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1c2VyLmVtYWlsX2FkZHJlc3MgPT0gbnVsbCB8fCB1c2VyLmVtYWlsX2FkZHJlc3MgPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXMuc2tpcHBlZFJlY29yZCsrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vQnVpbGQgS1BBIHVzZXIgRGF0YSBhbmQgQ2hlY2sgZXhpc3RpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBrcGFVc2VyIDogS1BBVXNlck1vZGVsIHwgbnVsbCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtwYUV4aXN0VXNlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrcGFFeGlzdFVzZXIgPSBrcGFFeGlzdFVzZXJzW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9Db21wYXJlIEtQQSBVc2VybmFtZSB3aXRoIFByb2NvcmUgdXNlciBlbWFpbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrcGFFeGlzdFVzZXIudXNlcm5hbWUgPT09IHVzZXIuZW1haWxfYWRkcmVzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrcGFVc2VyID0ga3BhRXhpc3RVc2VyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrcGFFeGlzdFVzZXJzLnNwbGljZShpLDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vQnVpbGQgS1BBIHVzZXIgRGF0YSBhbmQgQ2hlY2sgZXhpc3RpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrcGFVc2VyID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrcGFVc2VyID0gbmV3IEtQQVVzZXJNb2RlbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdXNlci5pc19hY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYFNraXAgVXNlciBiZWNhdXNlIG9mIFRlcm1pbmF0aW9uIERhdGUgJHt1c2VyLmVtYWlsX2FkZHJlc3N9ICR7dXNlci50ZXJtaW5hdGlvbkRhdGV9YClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzLnNraXBwZWRSZWNvcmQrK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5jb25maWcuaXNFZGl0VXNlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgU2tpcCBVc2VyIGJlY2F1c2Ugb2YgQ2Fubm90IEFsbG93IHRvIGVkaXQgJHt1c2VyLmVtYWlsX2FkZHJlc3N9YClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzLnNraXBwZWRSZWNvcmQrK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXVzZXIuaXNfYWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cy5pbmFjdGl2YXRlZFJlY29yZCsrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBrcGFVc2VyLmVtcGxveWVlTnVtYmVyID0gdXNlci5lbXBsb3llZV9pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXIuZmlyc3ROYW1lID0gdXNlci5maXJzdF9uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICBrcGFVc2VyLmxhc3ROYW1lID0gdXNlci5sYXN0X25hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBrcGFVc2VyLmVtYWlsID0gdXNlci5lbWFpbF9hZGRyZXNzO1xuICAgICAgICAgICAgICAgICAgICAgICAga3BhVXNlci51c2VybmFtZSA9IHVzZXIuZW1haWxfYWRkcmVzcztcbiAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXIuaW5pdGlhbFBhc3N3b3JkID0gYEtQQUZsZXgyMDI0ISFgO1xuICAgICAgICAgICAgICAgICAgICAgICAga3BhVXNlci5yb2xlID0gdGhpcy5jb25maWcuZGVmYXVsdFJvbGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBrcGFVc2VyLnRpdGxlID0gdXNlci5qb2JfdGl0bGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBrcGFVc2VyLndlbGNvbWVFbWFpbCA9IHRoaXMuY29uZmlnLmlzV2VsY29tZUVtYWlsXG4gICAgICAgICAgICAgICAgICAgICAgICBrcGFVc2VyLnJlc2V0UGFzc3dvcmQgPSB0aGlzLmNvbmZpZy5pc0ZvcmNlUmVzZXRQYXNzd29yZFxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXVzZXIuaXNfYWN0aXZlICYmIGtwYVVzZXIudGVybWluYXRpb25EYXRlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrcGFVc2VyLnRlcm1pbmF0aW9uRGF0ZSA9IG5ldyBEYXRlKCkudG9EYXRlU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXJzLnB1c2goa3BhVXNlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXMudXBzZXJ0UmVjb3JkKys7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvL1NlbmQgRGF0YVxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhrcGFVc2VycylcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3VjY2VzcyA9IGF3YWl0IGtwYVVzZXJBUEkuc2F2ZVVzZXIodGhpcy5jb25maWcua3BhU2l0ZSwga3BhVXNlcnMpXG4gICAgICAgICAgICAgICAgICAgIGlmICghc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBzYXZlIFVzZXJzJylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufVxuIl19