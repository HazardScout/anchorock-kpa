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
        catch (e) {
            console.log('Worker Stop with Error : ' + String(e));
            //Send an email to failed;
        }
    }
}
exports.ProcoreUserJob = ProcoreUserJob;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY29yZS11c2VyLWpvYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2NvcmUtaW50ZWdyYXRpb24vZnVuY3Rpb24vam9iL3Byb2NvcmUtdXNlci1qb2IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkRBQStEO0FBRS9ELCtEQUFtRTtBQUNuRSxnQ0FBb0M7QUFDcEMsb0NBQXdFO0FBQ3hFLHdDQUF1RDtBQUd2RCxNQUFhLGNBQWM7SUFJdkIsWUFBWSxNQUFvQztRQUM1QyxJQUFJLENBQUMsSUFBSSxHQUFHLGtCQUFrQixDQUFDO1FBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQWlCO1FBQzNCLElBQUksQ0FBQztZQUNELGlCQUFpQjtZQUNqQixJQUFJLFVBQVUsR0FBRyxJQUFJLGdCQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0RCxJQUFJLGFBQWEsR0FBRyxNQUFNLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNsRCxNQUFNLENBQUMsbUJBQW1CLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQztZQUNsRCxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFBO1lBRTFCLHVCQUF1QjtZQUN2QixJQUFJLElBQUksR0FBRyxJQUFJLHNCQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQ3pGLElBQUksVUFBVSxHQUFHLElBQUksZ0JBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFO2dCQUNwRCxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO2dCQUMvQyxJQUFJLENBQUMsTUFBTSxDQUFDLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7Z0JBRXZELElBQUksRUFBRSxHQUFHLElBQUksbUNBQXlCLEVBQUUsQ0FBQztnQkFDekMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN2QyxDQUFDLENBQUMsQ0FBQTtZQUNGLElBQUksU0FBUyxHQUFHLE1BQU0sVUFBVSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ2hELE1BQU0sQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUE7WUFFNUIsS0FBSSxJQUFJLE9BQU8sSUFBSSxTQUFTLEVBQUUsQ0FBQztnQkFDM0IsS0FBSSxJQUFJLGdCQUFnQixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztvQkFDeEQsSUFBSSxnQkFBZ0IsS0FBSyxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUM7d0JBQ2xDLElBQUksS0FBSyxHQUFHLE1BQU0sVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQ2xELE1BQU0sQ0FBQyxpQkFBaUIsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFBO3dCQUV4QyxJQUFJLFFBQVEsR0FBb0IsRUFBRSxDQUFDO3dCQUNuQyxLQUFJLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRSxDQUFDOzRCQUNwQixJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksRUFBRSxFQUFFLENBQUM7Z0NBQ3JELE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQTtnQ0FDdEIsU0FBUzs0QkFDYixDQUFDOzRCQUVELElBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxFQUFFLEVBQUUsQ0FBQztnQ0FDekQsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFBO2dDQUN0QixTQUFTOzRCQUNiLENBQUM7NEJBRUQsd0NBQXdDOzRCQUN4QyxJQUFJLE9BQU8sR0FBeUIsSUFBSSxDQUFDOzRCQUN6QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dDQUM1QyxNQUFNLFlBQVksR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBRXRDLDhDQUE4QztnQ0FDOUMsSUFBSSxZQUFZLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztvQ0FDL0MsT0FBTyxHQUFHLFlBQVksQ0FBQztvQ0FDdkIsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7b0NBQzFCLE1BQU07Z0NBQ1YsQ0FBQzs0QkFDTCxDQUFDOzRCQUVELHdDQUF3Qzs0QkFDeEMsSUFBSSxPQUFPLElBQUksSUFBSSxFQUFFLENBQUM7Z0NBQ2xCLE9BQU8sR0FBRyxJQUFJLG9CQUFZLEVBQUUsQ0FBQztnQ0FDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztvQ0FDbEIscUdBQXFHO29DQUNyRyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUE7b0NBQ3RCLFNBQVM7Z0NBQ2IsQ0FBQzs0QkFDTCxDQUFDO2lDQUFNLENBQUM7Z0NBQ0osSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7b0NBQzFCLGlGQUFpRjtvQ0FDakYsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFBO29DQUN0QixTQUFTO2dDQUNiLENBQUM7Z0NBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztvQ0FDbEIsTUFBTSxDQUFDLGlCQUFpQixFQUFFLENBQUE7Z0NBQzlCLENBQUM7NEJBQ0wsQ0FBQzs0QkFFRCxPQUFPLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7NEJBQzFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQTs0QkFDbkMsT0FBTyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDOzRCQUNsQyxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7NEJBQ25DLE9BQU8sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQzs0QkFDdEMsT0FBTyxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7NEJBQzFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7NEJBQ3ZDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQzs0QkFDL0IsT0FBTyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQTs0QkFDakQsT0FBTyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFBOzRCQUV4RCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxPQUFPLENBQUMsZUFBZSxJQUFJLElBQUksRUFBRSxDQUFDO2dDQUNyRCxPQUFPLENBQUMsZUFBZSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7NEJBQ3hELENBQUM7NEJBRUQsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzs0QkFDdkIsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO3dCQUMxQixDQUFDO3dCQUVELFdBQVc7d0JBQ1gsd0JBQXdCO3dCQUN4QixNQUFNLE9BQU8sR0FBRyxNQUFNLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUE7d0JBQ3hFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzs0QkFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUE7d0JBQ3ZDLENBQUM7b0JBQ0wsQ0FBQztnQkFDTCxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUM7UUFBQyxPQUFNLENBQUMsRUFBRSxDQUFDO1lBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsR0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNsRCwwQkFBMEI7UUFDOUIsQ0FBQztJQUNMLENBQUM7Q0FFSjtBQWxIRCx3Q0FrSEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBLUEFVc2VyQVBJIH0gZnJvbSBcIi4uLy4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL2FwaVwiO1xuaW1wb3J0IHsgSUpvYiB9IGZyb20gXCIuLi8uLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy9qb2JcIjtcbmltcG9ydCB7IEtQQVVzZXJNb2RlbCB9IGZyb20gXCIuLi8uLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy9tb2RlbFwiO1xuaW1wb3J0IHsgUHJvY29yZUFQSSB9IGZyb20gXCIuLi9hcGlcIjtcbmltcG9ydCB7IEtQQVByb2NvcmVDb25maWd1cmF0aW9uTW9kZWwsIHByb2NvcmVDb250ZXh0IH0gZnJvbSBcIi4uL21vZGVsXCI7XG5pbXBvcnQgeyBLUEFQcm9jb3JlQ29uZmlndXJhdGlvbkRCIH0gZnJvbSBcIi4uL21vbmdvZGJcIjtcbmltcG9ydCB7IEpvYlN0YXR1cyB9IGZyb20gXCIuLi8uLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy9qb2JcIjtcblxuZXhwb3J0IGNsYXNzIFByb2NvcmVVc2VySm9iIGltcGxlbWVudHMgSUpvYiB7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGNvbmZpZzogS1BBUHJvY29yZUNvbmZpZ3VyYXRpb25Nb2RlbDtcblxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogS1BBUHJvY29yZUNvbmZpZ3VyYXRpb25Nb2RlbCkge1xuICAgICAgICB0aGlzLm5hbWUgPSBcIlByb2NvcmUgVXNlciBKb2JcIjtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgfVxuXG4gICAgYXN5bmMgZXhlY3V0ZShzdGF0dXM6IEpvYlN0YXR1cyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy9GZXRjaCBLUEEgVXNlcnNcbiAgICAgICAgICAgIGxldCBrcGFVc2VyQVBJID0gbmV3IEtQQVVzZXJBUEkodGhpcy5jb25maWcua3BhVG9rZW4pO1xuICAgICAgICAgICAgbGV0IGtwYUV4aXN0VXNlcnMgPSBhd2FpdCBrcGFVc2VyQVBJLmdldEFsbFVzZXIoKTtcbiAgICAgICAgICAgIHN0YXR1cy50b3RhbEV4aXN0aW5nUmVjb3JkID0ga3BhRXhpc3RVc2Vycy5sZW5ndGg7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhrcGFFeGlzdFVzZXJzKVxuXG4gICAgICAgICAgICAvL0ZldGNoIFByb2NvcmUgQ29tcGFueVxuICAgICAgICAgICAgbGV0IGF1dGggPSBuZXcgcHJvY29yZUNvbnRleHQodGhpcy5jb25maWcucHJvY29yZVRva2VuLCB0aGlzLmNvbmZpZy5wcm9jb3JlUmVmcmVzaFRva2VuKTtcbiAgICAgICAgICAgIGxldCBwcm9jb3JlQVBJID0gbmV3IFByb2NvcmVBUEkoYXV0aCwgYXN5bmMgKG5ld0F1dGgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZy5wcm9jb3JlVG9rZW4gPSBuZXdBdXRoLmFjY2Vzc1Rva2VuO1xuICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLnByb2NvcmVSZWZyZXNoVG9rZW4gPSBuZXdBdXRoLnJlZnJlc2hUb2tlbjtcblxuICAgICAgICAgICAgICAgIGxldCBkYiA9IG5ldyBLUEFQcm9jb3JlQ29uZmlndXJhdGlvbkRCKCk7XG4gICAgICAgICAgICAgICAgZGIudXBkYXRlUHJvY29yZVRva2VuKHRoaXMuY29uZmlnKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBsZXQgY29tcGFuaWVzID0gYXdhaXQgcHJvY29yZUFQSS5nZXRDb21wYW5pZXMoKTtcbiAgICAgICAgICAgIHN0YXR1cy50b3RhbFNvdXJjZVJlY29yZCA9IDBcblxuICAgICAgICAgICAgZm9yKGxldCBjb21wYW55IG9mIGNvbXBhbmllcykge1xuICAgICAgICAgICAgICAgIGZvcihsZXQgcHJvY29yZUNvbXBhbnlJZCBvZiB0aGlzLmNvbmZpZy5wcm9jb3JlQ29tcGFueUlkcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvY29yZUNvbXBhbnlJZCA9PT0gY29tcGFueS5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHVzZXJzID0gYXdhaXQgcHJvY29yZUFQSS5nZXRVc2Vycyhjb21wYW55LmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cy50b3RhbFNvdXJjZVJlY29yZCArPSB1c2Vycy5sZW5ndGhcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGtwYVVzZXJzIDogS1BBVXNlck1vZGVsW10gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgdXNlciBvZiB1c2Vycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1c2VyLmVtcGxveWVlX2lkID09IG51bGwgfHwgdXNlci5lbXBsb3llZV9pZCA9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXMuc2tpcHBlZFJlY29yZCsrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1c2VyLmVtYWlsX2FkZHJlc3MgPT0gbnVsbCB8fCB1c2VyLmVtYWlsX2FkZHJlc3MgPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzLnNraXBwZWRSZWNvcmQrK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0J1aWxkIEtQQSB1c2VyIERhdGEgYW5kIENoZWNrIGV4aXN0aW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGtwYVVzZXIgOiBLUEFVc2VyTW9kZWwgfCBudWxsID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtwYUV4aXN0VXNlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qga3BhRXhpc3RVc2VyID0ga3BhRXhpc3RVc2Vyc1tpXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0NvbXBhcmUgS1BBIFVzZXJuYW1lIHdpdGggUHJvY29yZSB1c2VyIGVtYWlsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrcGFFeGlzdFVzZXIudXNlcm5hbWUgPT09IHVzZXIuZW1haWxfYWRkcmVzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga3BhVXNlciA9IGtwYUV4aXN0VXNlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtwYUV4aXN0VXNlcnMuc3BsaWNlKGksMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQnVpbGQgS1BBIHVzZXIgRGF0YSBhbmQgQ2hlY2sgZXhpc3RpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoa3BhVXNlciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXIgPSBuZXcgS1BBVXNlck1vZGVsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdXNlci5pc19hY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGBTa2lwIFVzZXIgYmVjYXVzZSBvZiBUZXJtaW5hdGlvbiBEYXRlICR7dXNlci5lbWFpbF9hZGRyZXNzfSAke3VzZXIudGVybWluYXRpb25EYXRlfWApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXMuc2tpcHBlZFJlY29yZCsrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5jb25maWcuaXNFZGl0VXNlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYFNraXAgVXNlciBiZWNhdXNlIG9mIENhbm5vdCBBbGxvdyB0byBlZGl0ICR7dXNlci5lbWFpbF9hZGRyZXNzfWApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXMuc2tpcHBlZFJlY29yZCsrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdXNlci5pc19hY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cy5pbmFjdGl2YXRlZFJlY29yZCsrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrcGFVc2VyLmVtcGxveWVlTnVtYmVyID0gdXNlci5lbXBsb3llZV9pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrcGFVc2VyLmZpcnN0TmFtZSA9IHVzZXIuZmlyc3RfbmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXIubGFzdE5hbWUgPSB1c2VyLmxhc3RfbmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrcGFVc2VyLmVtYWlsID0gdXNlci5lbWFpbF9hZGRyZXNzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXIudXNlcm5hbWUgPSB1c2VyLmVtYWlsX2FkZHJlc3M7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga3BhVXNlci5pbml0aWFsUGFzc3dvcmQgPSBgS1BBRmxleDIwMjQhIWA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga3BhVXNlci5yb2xlID0gdGhpcy5jb25maWcuZGVmYXVsdFJvbGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga3BhVXNlci50aXRsZSA9IHVzZXIuam9iX3RpdGxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXIud2VsY29tZUVtYWlsID0gdGhpcy5jb25maWcuaXNXZWxjb21lRW1haWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrcGFVc2VyLnJlc2V0UGFzc3dvcmQgPSB0aGlzLmNvbmZpZy5pc0ZvcmNlUmVzZXRQYXNzd29yZFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF1c2VyLmlzX2FjdGl2ZSAmJiBrcGFVc2VyLnRlcm1pbmF0aW9uRGF0ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXIudGVybWluYXRpb25EYXRlID0gbmV3IERhdGUoKS50b0RhdGVTdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrcGFVc2Vycy5wdXNoKGtwYVVzZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cy51cHNlcnRSZWNvcmQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9TZW5kIERhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGtwYVVzZXJzKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3VjY2VzcyA9IGF3YWl0IGtwYVVzZXJBUEkuc2F2ZVVzZXIodGhpcy5jb25maWcua3BhU2l0ZSwga3BhVXNlcnMpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIHNhdmUgVXNlcnMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdXb3JrZXIgU3RvcCB3aXRoIEVycm9yIDogJytTdHJpbmcoZSkpXG4gICAgICAgICAgICAvL1NlbmQgYW4gZW1haWwgdG8gZmFpbGVkO1xuICAgICAgICB9XG4gICAgfVxuXG59XG4iXX0=