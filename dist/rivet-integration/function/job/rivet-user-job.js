"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RivetUserJob = void 0;
const api_1 = require("../api");
const api_2 = require("../../../base-integration/src/api");
const model_1 = require("../../../base-integration/src/model");
const util_1 = require("util");
class RivetUserJob {
    constructor(config) {
        this.config = config;
        this.kpaSite = config["kpaSite"]["stringValue"];
        this.name = 'Rivet User Job - ' + this.kpaSite;
        this.kpaToken = config["kpaToken"]["stringValue"];
        this.clientId = config["clientId"]["stringValue"];
        this.token = config["token"]["stringValue"];
        this.isEditUser = config["isEditUser"]["stringValue"] == '1';
        this.defaultRole = config["defaultRole"]["stringValue"];
        this.welcomeEmail = config["welcomeEmail"]["stringValue"] === '1';
        this.resetPassword = config["resetPassword"]["stringValue"] === '1';
    }
    async execute(status) {
        (0, util_1.debuglog)('log:rivet:user')("Execute RivetUserJob Start");
        let kpaUserAPI = new api_2.KPAUserAPI(this.kpaToken);
        let kpaExistUsers = await kpaUserAPI.getAllUser();
        status.totalExistingRecord = kpaExistUsers.length;
        (0, util_1.debuglog)('log:rivet:user')(JSON.stringify(kpaExistUsers, null, 2));
        let rivetAPI = new api_1.RivetAPI(this.clientId, this.token);
        let users = await rivetAPI.getUsers();
        status.totalSourceRecord = users.length;
        let kpaUsers = [];
        for (let user of users) {
            var kpaUser = null;
            for (let i = 0; i < kpaExistUsers.length; i++) {
                const kpaExistUser = kpaExistUsers[i];
                if (kpaExistUser.employeeNumber === user.employeeId) {
                    kpaUser = kpaExistUser;
                    kpaExistUsers.splice(i, 1);
                    break;
                }
            }
            //Build KPA user Data and Check existing
            if (kpaUser == null) {
                kpaUser = new model_1.KPAUserModel();
                if (user.terminationDate !== null) {
                    status.skippedRecord++;
                    continue;
                }
            }
            else {
                if (!this.isEditUser) {
                    status.skippedRecord++;
                    continue;
                }
                if (user.terminationDate !== null) {
                    status.inactivatedRecord++;
                }
            }
            if (user.email === null || user.email === 'null') {
                status.skippedRecord++;
                continue;
            }
            kpaUser.employeeNumber = user.employeeId;
            kpaUser.firstName = user.firstName;
            kpaUser.lastName = user.lastName;
            kpaUser.username = user.email;
            if (!kpaUser.username || kpaUser.username === '') {
                kpaUser.username = user.employeeId;
            }
            kpaUser.email = user.email;
            kpaUser.initialPassword = `KPAFlex2024!!`;
            kpaUser.role = this.defaultRole;
            kpaUser.terminationDate = user.terminationDate;
            kpaUser.welcomeEmail = this.welcomeEmail;
            kpaUser.resetPassword = this.resetPassword;
            kpaUsers.push(kpaUser);
            status.upsertRecord++;
        }
        //Send Data
        (0, util_1.debuglog)('log:rivet:user')(String(kpaUsers.length));
        const success = await kpaUserAPI.saveUser(this.kpaSite, kpaUsers, this.isEditUser);
        if (!success) {
            throw new Error('Failed to save User:' + this.config.kpaSite);
        }
        (0, util_1.debuglog)('log:rivet:user')("Execute RivetUserJob Done");
    }
}
exports.RivetUserJob = RivetUserJob;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicml2ZXQtdXNlci1qb2IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9yaXZldC1pbnRlZ3JhdGlvbi9mdW5jdGlvbi9qb2Ivcml2ZXQtdXNlci1qb2IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsZ0NBQWtDO0FBQ2xDLDJEQUErRDtBQUcvRCwrREFBbUU7QUFDbkUsK0JBQWdDO0FBRWhDLE1BQWEsWUFBWTtJQVlyQixZQUFZLE1BQVc7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFFckIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLElBQUksR0FBRyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQy9DLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEdBQUcsQ0FBQztRQUM3RCxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxHQUFHLENBQUM7UUFDbEUsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssR0FBRyxDQUFDO0lBQ3hFLENB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QUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQzNCLE9BQU8sQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO1lBQzFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUNoQyxPQUFPLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7WUFDL0MsT0FBTyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFBO1lBQ3hDLE9BQU8sQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQTtZQUUxQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUMxQixDQUFDO1FBRUQsV0FBVztRQUNYLElBQUEsZUFBUSxFQUFDLGdCQUFnQixDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3BELE1BQU0sT0FBTyxHQUFHLE1BQU0sVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbkYsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ1gsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xFLENBQUM7UUFDRCxJQUFBLGVBQVEsRUFBQyxnQkFBZ0IsQ0FBQyxDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFDNUQsQ0FBQztDQUVKO0FBcEdELG9DQW9HQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJpdmV0QVBJIH0gZnJvbSBcIi4uL2FwaVwiO1xuaW1wb3J0IHsgS1BBVXNlckFQSSB9IGZyb20gXCIuLi8uLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy9hcGlcIjtcbmltcG9ydCB7IEpvYlN0YXR1cyB9IGZyb20gXCIuLi8uLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy9qb2JcIjtcbmltcG9ydCB7IElKb2IgfSBmcm9tIFwiLi4vLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvam9iL2pvYi1pbnRlcmZhY2VcIjtcbmltcG9ydCB7IEtQQVVzZXJNb2RlbCB9IGZyb20gXCIuLi8uLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy9tb2RlbFwiO1xuaW1wb3J0IHsgZGVidWdsb2cgfSBmcm9tICd1dGlsJztcblxuZXhwb3J0IGNsYXNzIFJpdmV0VXNlckpvYiBpbXBsZW1lbnRzIElKb2Ige1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBrcGFTaXRlOiBzdHJpbmc7XG4gICAga3BhVG9rZW46IHN0cmluZztcbiAgICBjbGllbnRJZDogc3RyaW5nO1xuICAgIHRva2VuOiBzdHJpbmc7XG4gICAgaXNFZGl0VXNlcjogYm9vbGVhbjtcbiAgICBjb25maWc6IGFueTtcbiAgICBkZWZhdWx0Um9sZTogc3RyaW5nO1xuICAgIHdlbGNvbWVFbWFpbDogYm9vbGVhbjtcbiAgICByZXNldFBhc3N3b3JkOiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IoY29uZmlnOiBhbnkpIHtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG5cbiAgICAgICAgdGhpcy5rcGFTaXRlID0gY29uZmlnW1wia3BhU2l0ZVwiXVtcInN0cmluZ1ZhbHVlXCJdO1xuICAgICAgICB0aGlzLm5hbWUgPSAnUml2ZXQgVXNlciBKb2IgLSAnICsgdGhpcy5rcGFTaXRlO1xuICAgICAgICB0aGlzLmtwYVRva2VuID0gY29uZmlnW1wia3BhVG9rZW5cIl1bXCJzdHJpbmdWYWx1ZVwiXTtcbiAgICAgICAgdGhpcy5jbGllbnRJZCA9IGNvbmZpZ1tcImNsaWVudElkXCJdW1wic3RyaW5nVmFsdWVcIl07XG4gICAgICAgIHRoaXMudG9rZW4gPSBjb25maWdbXCJ0b2tlblwiXVtcInN0cmluZ1ZhbHVlXCJdO1xuICAgICAgICB0aGlzLmlzRWRpdFVzZXIgPSBjb25maWdbXCJpc0VkaXRVc2VyXCJdW1wic3RyaW5nVmFsdWVcIl0gPT0gJzEnO1xuICAgICAgICB0aGlzLmRlZmF1bHRSb2xlID0gY29uZmlnW1wiZGVmYXVsdFJvbGVcIl1bXCJzdHJpbmdWYWx1ZVwiXTtcbiAgICAgICAgdGhpcy53ZWxjb21lRW1haWwgPSBjb25maWdbXCJ3ZWxjb21lRW1haWxcIl1bXCJzdHJpbmdWYWx1ZVwiXSA9PT0gJzEnO1xuICAgICAgICB0aGlzLnJlc2V0UGFzc3dvcmQgPSBjb25maWdbXCJyZXNldFBhc3N3b3JkXCJdW1wic3RyaW5nVmFsdWVcIl0gPT09ICcxJztcbiAgICB9XG5cbiAgICBhc3luYyBleGVjdXRlKHN0YXR1czpKb2JTdGF0dXMpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgZGVidWdsb2coJ2xvZzpyaXZldDp1c2VyJykoXCJFeGVjdXRlIFJpdmV0VXNlckpvYiBTdGFydFwiKTtcbiAgICAgICAgbGV0IGtwYVVzZXJBUEkgPSBuZXcgS1BBVXNlckFQSSh0aGlzLmtwYVRva2VuKTtcbiAgICAgICAgbGV0IGtwYUV4aXN0VXNlcnMgPSBhd2FpdCBrcGFVc2VyQVBJLmdldEFsbFVzZXIoKTtcbiAgICAgICAgc3RhdHVzLnRvdGFsRXhpc3RpbmdSZWNvcmQgPSBrcGFFeGlzdFVzZXJzLmxlbmd0aDtcbiAgICAgICAgZGVidWdsb2coJ2xvZzpyaXZldDp1c2VyJykoSlNPTi5zdHJpbmdpZnkoa3BhRXhpc3RVc2VycywgbnVsbCwgMikpO1xuXG4gICAgICAgIGxldCByaXZldEFQSSA9IG5ldyBSaXZldEFQSSh0aGlzLmNsaWVudElkLCB0aGlzLnRva2VuKTtcbiAgICAgICAgbGV0IHVzZXJzID0gYXdhaXQgcml2ZXRBUEkuZ2V0VXNlcnMoKTtcbiAgICAgICAgc3RhdHVzLnRvdGFsU291cmNlUmVjb3JkID0gdXNlcnMubGVuZ3RoXG5cbiAgICAgICAgbGV0IGtwYVVzZXJzIDogS1BBVXNlck1vZGVsW10gPSBbXTtcbiAgICAgICAgZm9yKGxldCB1c2VyIG9mIHVzZXJzKSB7XG4gICAgICAgICAgICB2YXIga3BhVXNlciA6IEtQQVVzZXJNb2RlbCB8IG51bGwgPSBudWxsO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrcGFFeGlzdFVzZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qga3BhRXhpc3RVc2VyID0ga3BhRXhpc3RVc2Vyc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoa3BhRXhpc3RVc2VyLmVtcGxveWVlTnVtYmVyID09PSB1c2VyLmVtcGxveWVlSWQpIHtcbiAgICAgICAgICAgICAgICAgICAga3BhVXNlciA9IGtwYUV4aXN0VXNlcjtcbiAgICAgICAgICAgICAgICAgICAga3BhRXhpc3RVc2Vycy5zcGxpY2UoaSwxKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL0J1aWxkIEtQQSB1c2VyIERhdGEgYW5kIENoZWNrIGV4aXN0aW5nXG4gICAgICAgICAgICBpZiAoa3BhVXNlciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAga3BhVXNlciA9IG5ldyBLUEFVc2VyTW9kZWwoKTtcbiAgICAgICAgICAgICAgICBpZiAodXNlci50ZXJtaW5hdGlvbkRhdGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLnNraXBwZWRSZWNvcmQrK1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc0VkaXRVc2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5za2lwcGVkUmVjb3JkKytcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh1c2VyLnRlcm1pbmF0aW9uRGF0ZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuaW5hY3RpdmF0ZWRSZWNvcmQrK1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHVzZXIuZW1haWwgPT09IG51bGwgfHwgdXNlci5lbWFpbCA9PT0gJ251bGwnKSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzLnNraXBwZWRSZWNvcmQrK1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBrcGFVc2VyLmVtcGxveWVlTnVtYmVyID0gdXNlci5lbXBsb3llZUlkO1xuICAgICAgICAgICAga3BhVXNlci5maXJzdE5hbWUgPSB1c2VyLmZpcnN0TmFtZVxuICAgICAgICAgICAga3BhVXNlci5sYXN0TmFtZSA9IHVzZXIubGFzdE5hbWU7XG4gICAgICAgICAgICBrcGFVc2VyLnVzZXJuYW1lID0gdXNlci5lbWFpbDtcblxuICAgICAgICAgICAgaWYgKCFrcGFVc2VyLnVzZXJuYW1lIHx8IGtwYVVzZXIudXNlcm5hbWUgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAga3BhVXNlci51c2VybmFtZSA9IHVzZXIuZW1wbG95ZWVJZFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBrcGFVc2VyLmVtYWlsID0gdXNlci5lbWFpbDtcbiAgICAgICAgICAgIGtwYVVzZXIuaW5pdGlhbFBhc3N3b3JkID0gYEtQQUZsZXgyMDI0ISFgO1xuICAgICAgICAgICAga3BhVXNlci5yb2xlID0gdGhpcy5kZWZhdWx0Um9sZTtcbiAgICAgICAgICAgIGtwYVVzZXIudGVybWluYXRpb25EYXRlID0gdXNlci50ZXJtaW5hdGlvbkRhdGU7XG4gICAgICAgICAgICBrcGFVc2VyLndlbGNvbWVFbWFpbCA9IHRoaXMud2VsY29tZUVtYWlsXG4gICAgICAgICAgICBrcGFVc2VyLnJlc2V0UGFzc3dvcmQgPSB0aGlzLnJlc2V0UGFzc3dvcmRcblxuICAgICAgICAgICAga3BhVXNlcnMucHVzaChrcGFVc2VyKTtcbiAgICAgICAgICAgIHN0YXR1cy51cHNlcnRSZWNvcmQrKztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vU2VuZCBEYXRhXG4gICAgICAgIGRlYnVnbG9nKCdsb2c6cml2ZXQ6dXNlcicpKFN0cmluZyhrcGFVc2Vycy5sZW5ndGgpKTtcbiAgICAgICAgY29uc3Qgc3VjY2VzcyA9IGF3YWl0IGtwYVVzZXJBUEkuc2F2ZVVzZXIodGhpcy5rcGFTaXRlLCBrcGFVc2VycywgdGhpcy5pc0VkaXRVc2VyKTtcbiAgICAgICAgaWYgKCFzdWNjZXNzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBzYXZlIFVzZXI6JyArIHRoaXMuY29uZmlnLmtwYVNpdGUpO1xuICAgICAgICB9XG4gICAgICAgIGRlYnVnbG9nKCdsb2c6cml2ZXQ6dXNlcicpKFwiRXhlY3V0ZSBSaXZldFVzZXJKb2IgRG9uZVwiKTtcbiAgICB9XG5cbn1cbiJdfQ==