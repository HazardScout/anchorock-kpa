"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpectrumUserJob = void 0;
const api_1 = require("../../../base-integration/src/api");
const model_1 = require("../../../base-integration/src/model");
const api_2 = require("../api");
class SpectrumUserJob {
    constructor(config) {
        this.name = 'Spectrum User Job';
        this.config = config;
        this.kpaSite = config["kpaSite"]["stringValue"];
        this.kpaToken = config["kpaToken"]["stringValue"];
        this.serverUrl = config["serverUrl"]["stringValue"];
        this.companyCodes = JSON.parse(config["companyCodes"]["stringValue"]);
        this.authorizationId = config["authorizationId"]["stringValue"];
        this.isEditUser = config["isEditUser"]["stringValue"] == '1';
        this.defaultRole = config["defaultRole"]["stringValue"];
        this.welcomeEmail = config["welcomeEmail"]["stringValue"] === '1';
        this.resetPassword = config["resetPassword"]["stringValue"] === '1';
    }
    async execute(status) {
        console.log("Execute SpectrumUserJob Start");
        try {
            //Fetch KPA Users
            let kpaUserAPI = new api_1.KPAUserAPI(this.kpaToken);
            let kpaExistUsers = await kpaUserAPI.getAllUser();
            status.totalExistingRecord = kpaExistUsers.length;
            console.log(kpaExistUsers);
            let kpaUsers = [];
            for (var companyCode of this.companyCodes) {
                //Fetch Spectrum Users
                let spectrumAPI = new api_2.SpectrumAPI(this.serverUrl, this.authorizationId, companyCode);
                let users = await spectrumAPI.getUsers();
                status.totalSourceRecord = users.length;
                //Loop Spectrum Users
                for (let user of users) {
                    var kpaUser = null;
                    for (let i = 0; i < kpaExistUsers.length; i++) {
                        const kpaExistUser = kpaExistUsers[i];
                        const employeeCode = `${companyCode}-${user.employeeCode}`;
                        if (kpaExistUser.employeeNumber === employeeCode) {
                            kpaUser = kpaExistUser;
                            kpaExistUsers.splice(i, 1);
                            break;
                        }
                    }
                    //Build KPA user Data and Check existing
                    if (kpaUser == null) {
                        kpaUser = new model_1.KPAUserModel();
                        if (user.employeeStatus !== 'A') {
                            // console.log(`Skip User because of Termination Date ${user.employeeId} ${user.terminationDate}`)
                            status.skippedRecord++;
                            continue;
                        }
                    }
                    else {
                        if (!this.isEditUser) {
                            // console.log(`Skip User because of Cannot Allow to edit ${user.employeeId}`)
                            status.skippedRecord++;
                            continue;
                        }
                        if (user.employeeStatus !== 'A') {
                            status.inactivatedRecord++;
                        }
                    }
                    //Create Users 
                    kpaUser.employeeNumber = `${companyCode}-${user.employeeCode}`;
                    kpaUser.firstName = user.firstName;
                    kpaUser.lastName = user.lastName;
                    kpaUser.username = `${companyCode}-${user.employeeCode}`;
                    kpaUser.email = '';
                    kpaUser.initialPassword = `KPAFlex2024!!`;
                    kpaUser.role = this.defaultRole;
                    kpaUser.title = user.title;
                    kpaUser.welcomeEmail = this.welcomeEmail;
                    kpaUser.resetPassword = this.resetPassword;
                    if (user.employeeStatus !== 'A' && kpaUser.terminationDate == null) {
                        kpaUser.terminationDate = new Date().toDateString();
                        console.log(`Need to Check ${kpaUser.terminationDate}`);
                    }
                    //Add User To List
                    kpaUsers.push(kpaUser);
                    status.upsertRecord++;
                }
            }
            //Send Data
            console.log(kpaUsers.length);
            const success = await kpaUserAPI.saveUser(this.kpaSite, kpaUsers, this.isEditUser);
            if (!success) {
                console.log('Failed to save Users');
            }
        }
        catch (e) {
            console.log(`Worker Stop with Error : ${e}`);
        }
        console.log("Execute SpectrumUserJob Done");
    }
}
exports.SpectrumUserJob = SpectrumUserJob;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlY3RydW0tdXNlci1qb2IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcGVjdHJ1bS1pbnRlZ3JhdGlvbi9mdW5jdGlvbi9qb2Ivc3BlY3RydW0tdXNlci1qb2IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkRBQStEO0FBRS9ELCtEQUFtRTtBQUNuRSxnQ0FBcUM7QUFFckMsTUFBYSxlQUFlO0lBYXhCLFlBQVksTUFBVztRQUNuQixJQUFJLENBQUMsSUFBSSxHQUFHLG1CQUFtQixDQUFDO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRXJCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEdBQUcsQ0FBQztRQUM3RCxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxHQUFHLENBQUM7UUFDbEUsSUFBSSxDQUFD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QUMsQ0FBQTtRQUNoRCxDQUFDO1FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0lBQ2hELENBQUM7Q0FFSjtBQWhIRCwwQ0FnSEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBLUEFVc2VyQVBJIH0gZnJvbSBcIi4uLy4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL2FwaVwiO1xuaW1wb3J0IHsgSUpvYiwgSm9iU3RhdHVzIH0gZnJvbSBcIi4uLy4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL2pvYlwiO1xuaW1wb3J0IHsgS1BBVXNlck1vZGVsIH0gZnJvbSBcIi4uLy4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL21vZGVsXCI7XG5pbXBvcnQgeyBTcGVjdHJ1bUFQSSB9IGZyb20gXCIuLi9hcGlcIjtcblxuZXhwb3J0IGNsYXNzIFNwZWN0cnVtVXNlckpvYiBpbXBsZW1lbnRzIElKb2Ige1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBrcGFTaXRlOiBzdHJpbmc7XG4gICAga3BhVG9rZW46IHN0cmluZztcbiAgICBzZXJ2ZXJVcmw6IHN0cmluZztcbiAgICBjb21wYW55Q29kZXM6IHN0cmluZ1tdO1xuICAgIGF1dGhvcml6YXRpb25JZDogc3RyaW5nO1xuICAgIGlzRWRpdFVzZXI6IGJvb2xlYW47XG4gICAgY29uZmlnOiBhbnk7XG4gICAgZGVmYXVsdFJvbGU6IHN0cmluZztcbiAgICB3ZWxjb21lRW1haWw6IGJvb2xlYW47XG4gICAgcmVzZXRQYXNzd29yZDogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogYW55KSB7XG4gICAgICAgIHRoaXMubmFtZSA9ICdTcGVjdHJ1bSBVc2VyIEpvYic7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuXG4gICAgICAgIHRoaXMua3BhU2l0ZSA9IGNvbmZpZ1tcImtwYVNpdGVcIl1bXCJzdHJpbmdWYWx1ZVwiXTtcbiAgICAgICAgdGhpcy5rcGFUb2tlbiA9IGNvbmZpZ1tcImtwYVRva2VuXCJdW1wic3RyaW5nVmFsdWVcIl07XG4gICAgICAgIHRoaXMuc2VydmVyVXJsID0gY29uZmlnW1wic2VydmVyVXJsXCJdW1wic3RyaW5nVmFsdWVcIl07XG4gICAgICAgIHRoaXMuY29tcGFueUNvZGVzID0gSlNPTi5wYXJzZShjb25maWdbXCJjb21wYW55Q29kZXNcIl1bXCJzdHJpbmdWYWx1ZVwiXSk7XG4gICAgICAgIHRoaXMuYXV0aG9yaXphdGlvbklkID0gY29uZmlnW1wiYXV0aG9yaXphdGlvbklkXCJdW1wic3RyaW5nVmFsdWVcIl07XG4gICAgICAgIHRoaXMuaXNFZGl0VXNlciA9IGNvbmZpZ1tcImlzRWRpdFVzZXJcIl1bXCJzdHJpbmdWYWx1ZVwiXSA9PSAnMSc7XG4gICAgICAgIHRoaXMuZGVmYXVsdFJvbGUgPSBjb25maWdbXCJkZWZhdWx0Um9sZVwiXVtcInN0cmluZ1ZhbHVlXCJdO1xuICAgICAgICB0aGlzLndlbGNvbWVFbWFpbCA9IGNvbmZpZ1tcIndlbGNvbWVFbWFpbFwiXVtcInN0cmluZ1ZhbHVlXCJdID09PSAnMSc7XG4gICAgICAgIHRoaXMucmVzZXRQYXNzd29yZCA9IGNvbmZpZ1tcInJlc2V0UGFzc3dvcmRcIl1bXCJzdHJpbmdWYWx1ZVwiXSA9PT0gJzEnO1xuICAgIH1cblxuICAgIGFzeW5jIGV4ZWN1dGUoc3RhdHVzOiBKb2JTdGF0dXMpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJFeGVjdXRlIFNwZWN0cnVtVXNlckpvYiBTdGFydFwiKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vRmV0Y2ggS1BBIFVzZXJzXG4gICAgICAgICAgICBsZXQga3BhVXNlckFQSSA9IG5ldyBLUEFVc2VyQVBJKHRoaXMua3BhVG9rZW4pO1xuICAgICAgICAgICAgbGV0IGtwYUV4aXN0VXNlcnMgPSBhd2FpdCBrcGFVc2VyQVBJLmdldEFsbFVzZXIoKTtcbiAgICAgICAgICAgIHN0YXR1cy50b3RhbEV4aXN0aW5nUmVjb3JkID0ga3BhRXhpc3RVc2Vycy5sZW5ndGg7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhrcGFFeGlzdFVzZXJzKVxuXG4gICAgICAgICAgICBsZXQga3BhVXNlcnMgOiBLUEFVc2VyTW9kZWxbXSA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgY29tcGFueUNvZGUgb2YgdGhpcy5jb21wYW55Q29kZXMpIHtcbiAgICAgICAgICAgICAgICAvL0ZldGNoIFNwZWN0cnVtIFVzZXJzXG4gICAgICAgICAgICAgICAgbGV0IHNwZWN0cnVtQVBJID0gbmV3IFNwZWN0cnVtQVBJKHRoaXMuc2VydmVyVXJsLCB0aGlzLmF1dGhvcml6YXRpb25JZCwgY29tcGFueUNvZGUpO1xuICAgICAgICAgICAgICAgIGxldCB1c2VycyA9IGF3YWl0IHNwZWN0cnVtQVBJLmdldFVzZXJzKCk7XG4gICAgICAgICAgICAgICAgc3RhdHVzLnRvdGFsU291cmNlUmVjb3JkID0gdXNlcnMubGVuZ3RoXG5cbiAgICAgICAgICAgICAgICAvL0xvb3AgU3BlY3RydW0gVXNlcnNcbiAgICAgICAgICAgICAgICBmb3IobGV0IHVzZXIgb2YgdXNlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGtwYVVzZXIgOiBLUEFVc2VyTW9kZWwgfCBudWxsID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrcGFFeGlzdFVzZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrcGFFeGlzdFVzZXIgPSBrcGFFeGlzdFVzZXJzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZW1wbG95ZWVDb2RlID0gYCR7Y29tcGFueUNvZGV9LSR7dXNlci5lbXBsb3llZUNvZGV9YDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrcGFFeGlzdFVzZXIuZW1wbG95ZWVOdW1iZXIgPT09IGVtcGxveWVlQ29kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtwYVVzZXIgPSBrcGFFeGlzdFVzZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga3BhRXhpc3RVc2Vycy5zcGxpY2UoaSwxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vQnVpbGQgS1BBIHVzZXIgRGF0YSBhbmQgQ2hlY2sgZXhpc3RpbmdcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtwYVVzZXIgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAga3BhVXNlciA9IG5ldyBLUEFVc2VyTW9kZWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh1c2VyLmVtcGxveWVlU3RhdHVzICE9PSAnQScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgU2tpcCBVc2VyIGJlY2F1c2Ugb2YgVGVybWluYXRpb24gRGF0ZSAke3VzZXIuZW1wbG95ZWVJZH0gJHt1c2VyLnRlcm1pbmF0aW9uRGF0ZX1gKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cy5za2lwcGVkUmVjb3JkKytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc0VkaXRVc2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYFNraXAgVXNlciBiZWNhdXNlIG9mIENhbm5vdCBBbGxvdyB0byBlZGl0ICR7dXNlci5lbXBsb3llZUlkfWApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzLnNraXBwZWRSZWNvcmQrK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodXNlci5lbXBsb3llZVN0YXR1cyAhPT0gJ0EnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmluYWN0aXZhdGVkUmVjb3JkKytcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vQ3JlYXRlIFVzZXJzIFxuICAgICAgICAgICAgICAgICAgICBrcGFVc2VyLmVtcGxveWVlTnVtYmVyID0gYCR7Y29tcGFueUNvZGV9LSR7dXNlci5lbXBsb3llZUNvZGV9YDtcbiAgICAgICAgICAgICAgICAgICAga3BhVXNlci5maXJzdE5hbWUgPSB1c2VyLmZpcnN0TmFtZVxuICAgICAgICAgICAgICAgICAgICBrcGFVc2VyLmxhc3ROYW1lID0gdXNlci5sYXN0TmFtZTtcbiAgICAgICAgICAgICAgICAgICAga3BhVXNlci51c2VybmFtZSA9IGAke2NvbXBhbnlDb2RlfS0ke3VzZXIuZW1wbG95ZWVDb2RlfWA7XG4gICAgICAgICAgICAgICAgICAgIGtwYVVzZXIuZW1haWwgPSAnJztcbiAgICAgICAgICAgICAgICAgICAga3BhVXNlci5pbml0aWFsUGFzc3dvcmQgPSBgS1BBRmxleDIwMjQhIWA7XG4gICAgICAgICAgICAgICAgICAgIGtwYVVzZXIucm9sZSA9IHRoaXMuZGVmYXVsdFJvbGU7XG4gICAgICAgICAgICAgICAgICAgIGtwYVVzZXIudGl0bGUgPSB1c2VyLnRpdGxlXG4gICAgICAgICAgICAgICAgICAgIGtwYVVzZXIud2VsY29tZUVtYWlsID0gdGhpcy53ZWxjb21lRW1haWxcbiAgICAgICAgICAgICAgICAgICAga3BhVXNlci5yZXNldFBhc3N3b3JkID0gdGhpcy5yZXNldFBhc3N3b3JkXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHVzZXIuZW1wbG95ZWVTdGF0dXMgIT09ICdBJyAmJiBrcGFVc2VyLnRlcm1pbmF0aW9uRGF0ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrcGFVc2VyLnRlcm1pbmF0aW9uRGF0ZSA9IG5ldyBEYXRlKCkudG9EYXRlU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgTmVlZCB0byBDaGVjayAke2twYVVzZXIudGVybWluYXRpb25EYXRlfWApXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvL0FkZCBVc2VyIFRvIExpc3RcbiAgICAgICAgICAgICAgICAgICAga3BhVXNlcnMucHVzaChrcGFVc2VyKTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLnVwc2VydFJlY29yZCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9TZW5kIERhdGFcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGtwYVVzZXJzLmxlbmd0aClcbiAgICAgICAgICAgIGNvbnN0IHN1Y2Nlc3MgPSBhd2FpdCBrcGFVc2VyQVBJLnNhdmVVc2VyKHRoaXMua3BhU2l0ZSwga3BhVXNlcnMsIHRoaXMuaXNFZGl0VXNlcilcbiAgICAgICAgICAgIGlmICghc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gc2F2ZSBVc2VycycpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYFdvcmtlciBTdG9wIHdpdGggRXJyb3IgOiAke2V9YClcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcIkV4ZWN1dGUgU3BlY3RydW1Vc2VySm9iIERvbmVcIik7XG4gICAgfVxuXG59Il19