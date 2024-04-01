"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _KPAUserAPI_instances, _KPAUserAPI_sendDataToKPA;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KPAUserAPI = void 0;
const axios_1 = require("axios");
const model_1 = require("../model");
const utilities_1 = require("../utilities");
const util_1 = require("util");
class KPAUserAPI {
    constructor(token) {
        _KPAUserAPI_instances.add(this);
        this.token = token;
        this.apiInstance = axios_1.default.create({ baseURL: 'https://api.kpaehs.com/v1' });
    }
    async getAllUser() {
        let result = [];
        const { data } = await this.apiInstance.post('users.list', { token: this.token });
        for (var userData of data.users) {
            let user = Object.assign(new model_1.KPAUserModel(), userData);
            result.push(user);
        }
        return result;
    }
    async saveUser(site, models, isEditUSer) {
        var cleanRecords = [];
        var invalidRecords = [];
        for (var model of models) {
            //Ignore user without employee number
            if (model.employeeNumber === null || model.employeeNumber === '') {
                invalidRecords.push(model);
                continue;
            }
            var isDuplicate = false;
            for (let i = 0; i < cleanRecords.length; i++) {
                var clearRecord = cleanRecords[i];
                if (clearRecord.username === model.username || clearRecord.employeeNumber === model.employeeNumber) {
                    isDuplicate = true;
                    invalidRecords.push(model);
                    invalidRecords.push(clearRecord);
                    cleanRecords.splice(i, 1);
                    break;
                }
            }
            if (!isDuplicate) {
                for (var invalidRecord of invalidRecords) {
                    if (invalidRecord.username === model.username || invalidRecord.employeeNumber === model.employeeNumber) {
                        isDuplicate = true;
                        invalidRecords.push(model);
                        break;
                    }
                }
            }
            if (!isDuplicate) {
                cleanRecords.push(model);
            }
        }
        if (cleanRecords.length > 0) {
            await __classPrivateFieldGet(this, _KPAUserAPI_instances, "m", _KPAUserAPI_sendDataToKPA).call(this, site, cleanRecords, isEditUSer);
        }
        if (invalidRecords.length > 0) {
            await __classPrivateFieldGet(this, _KPAUserAPI_instances, "m", _KPAUserAPI_sendDataToKPA).call(this, site, invalidRecords, isEditUSer);
        }
        return true;
    }
}
exports.KPAUserAPI = KPAUserAPI;
_KPAUserAPI_instances = new WeakSet(), _KPAUserAPI_sendDataToKPA = async function _KPAUserAPI_sendDataToKPA(site, models, isEditUSer) {
    var _a;
    let headers = '';
    if (isEditUSer) {
        headers = 'Site,RecordType,Name,EmployeeNumber,FirstName,LastName,Username,InitialPassword,Role,Title,Email,TerminationDate,ForcePasswordSelection,SendWelcomeEmail,UpdatePolicy';
    }
    else {
        headers = 'Site,RecordType,Name,EmployeeNumber,FirstName,LastName,Username,InitialPassword,Role,Title,Email,TerminationDate,ForcePasswordSelection,SendWelcomeEmail';
    }
    var jobTitles = [];
    for (var model of models) {
        if (model.title != null && model.title !== '' && jobTitles.indexOf(model.title) == -1) {
            jobTitles.push(model.title);
        }
    }
    var content = `${headers}`;
    for (var jobTitle of jobTitles) {
        var dataUser = `${site},JobTitle`;
        dataUser = `${dataUser},${utilities_1.Helper.csvContentChecker(jobTitle)}`;
        content = `${content}\n${dataUser}`;
    }
    for (var model of models) {
        var dataUser = `${site},Employee,`;
        dataUser = `${dataUser},${utilities_1.Helper.csvContentChecker(model.employeeNumber)}`;
        dataUser = `${dataUser},${utilities_1.Helper.csvContentChecker(model.firstName)}`;
        dataUser = `${dataUser},${utilities_1.Helper.csvContentChecker(model.lastName)}`;
        dataUser = `${dataUser},${utilities_1.Helper.csvContentChecker(model.username)}`;
        dataUser = `${dataUser},${utilities_1.Helper.csvContentChecker(model.initialPassword)}`;
        dataUser = `${dataUser},${utilities_1.Helper.csvContentChecker(model.role)}`;
        dataUser = `${dataUser},${utilities_1.Helper.csvContentChecker(model.title)}`;
        dataUser = `${dataUser},${utilities_1.Helper.csvContentChecker(model.email)}`;
        dataUser = `${dataUser},${utilities_1.Helper.csvContentChecker((_a = model.terminationDate) !== null && _a !== void 0 ? _a : '')}`;
        dataUser = `${dataUser},${model.resetPassword ? 'Y' : 'N'}`;
        dataUser = `${dataUser},${model.welcomeEmail ? 'Y' : 'N'}`;
        if (isEditUSer) {
            dataUser = `${dataUser},Always`;
        }
        content = `${content}\n${dataUser}`;
    }
    const fileData = Buffer.from(content, 'binary').toString('base64');
    const { data } = await this.apiInstance.post('dataload.create', {
        token: this.token,
        file: `data:text/csv;base64,${fileData}`,
        name: 'employees.csv',
        failureEmails: [],
        successEmails: []
    });
    (0, util_1.debuglog)('log:worker:dataload-response')('procore.employees', data);
    if (!data.ok) {
        throw new Error(`${data.error}:${data.description}`);
    }
    return data.ok;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3BhLXVzZXItYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvYXBpL2twYS11c2VyLWFwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxpQ0FBcUM7QUFDckMsb0NBQXdDO0FBQ3hDLDRDQUFzQztBQUN0QywrQkFBZ0M7QUFFaEMsTUFBYSxVQUFVO0lBSW5CLFlBQVksS0FBYTs7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxlQUFLLENBQUMsTUFBTSxDQUFDLEVBQUMsT0FBTyxFQUFFLDJCQUEyQixFQUFDLENBQUMsQ0FBQTtJQUMzRSxDQUFDO0lBRUQsS0FBSyxDQUFDLFVBQVU7UUFDWixJQUFJLE1BQU0sR0FBb0IsRUFBRSxDQUFDO1FBQ2pDLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxFQUFDLEtBQUssRUFBQyxJQUFJLENBQUMsS0FBSyxFQUFDLENBQUMsQ0FBQztRQUMvRSxLQUFLLElBQUksUUFBUSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM5QixJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksb0JBQVksRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEIsQ0FBQztRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxLQUFLLENBQUMsUUFBUSxDQUFDLElBQVksRUFBRSxNQUFzQixFQUFFLFVBQW1CO1FBQ3BFLElBQUksWUFBWSxHQUFvQixFQUFFLENBQUE7UUFDdEMsSUFBSSxjQUFjLEdBQW9CLEVBQUUsQ0FBQTtRQUV4QyxLQUFLLElBQUksS0FBSyxJQUFJLE1BQU0sRUFB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Q0FBQTtJQUN2QyxDQUFDO0lBRUQsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRW5FLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFO1FBQzVELEtBQUssRUFBQyxJQUFJLENBQUMsS0FBSztRQUNoQixJQUFJLEVBQUUsd0JBQXdCLFFBQVEsRUFBRTtRQUN4QyxJQUFJLEVBQUUsZUFBZTtRQUNyQixhQUFhLEVBQUUsRUFBRTtRQUNqQixhQUFhLEVBQUUsRUFBRTtLQUNwQixDQUFDLENBQUM7SUFFSCxJQUFBLGVBQVEsRUFBQyw4QkFBOEIsQ0FBQyxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFBO0lBQ25FLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDWCxNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDO0FBQ25CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MsIHsgQXhpb3MgfSBmcm9tIFwiYXhpb3NcIjtcbmltcG9ydCB7IEtQQVVzZXJNb2RlbCB9IGZyb20gXCIuLi9tb2RlbFwiO1xuaW1wb3J0IHsgSGVscGVyIH0gZnJvbSBcIi4uL3V0aWxpdGllc1wiO1xuaW1wb3J0IHsgZGVidWdsb2cgfSBmcm9tICd1dGlsJztcblxuZXhwb3J0IGNsYXNzIEtQQVVzZXJBUEkge1xuICAgIHRva2VuOiBzdHJpbmc7XG4gICAgYXBpSW5zdGFuY2U6IEF4aW9zO1xuXG4gICAgY29uc3RydWN0b3IodG9rZW46IHN0cmluZykge1xuICAgICAgICB0aGlzLnRva2VuID0gdG9rZW47XG4gICAgICAgIHRoaXMuYXBpSW5zdGFuY2UgPSBheGlvcy5jcmVhdGUoe2Jhc2VVUkw6ICdodHRwczovL2FwaS5rcGFlaHMuY29tL3YxJ30pXG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0QWxsVXNlcigpOlByb21pc2U8S1BBVXNlck1vZGVsW10+IHtcbiAgICAgICAgbGV0IHJlc3VsdCA6IEtQQVVzZXJNb2RlbFtdID0gW107XG4gICAgICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy5hcGlJbnN0YW5jZS5wb3N0KCd1c2Vycy5saXN0Jywge3Rva2VuOnRoaXMudG9rZW59KTtcbiAgICAgICAgZm9yICh2YXIgdXNlckRhdGEgb2YgZGF0YS51c2Vycykge1xuICAgICAgICAgICAgbGV0IHVzZXIgPSBPYmplY3QuYXNzaWduKG5ldyBLUEFVc2VyTW9kZWwoKSwgdXNlckRhdGEpO1xuICAgICAgICAgICAgcmVzdWx0LnB1c2godXNlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBhc3luYyBzYXZlVXNlcihzaXRlOiBzdHJpbmcsIG1vZGVsczogS1BBVXNlck1vZGVsW10sIGlzRWRpdFVTZXI6IGJvb2xlYW4pIDogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIHZhciBjbGVhblJlY29yZHMgOiBLUEFVc2VyTW9kZWxbXSA9IFtdXG4gICAgICAgIHZhciBpbnZhbGlkUmVjb3JkcyA6IEtQQVVzZXJNb2RlbFtdID0gW11cblxuICAgICAgICBmb3IgKHZhciBtb2RlbCBvZiBtb2RlbHMpIHtcblxuICAgICAgICAgICAgLy9JZ25vcmUgdXNlciB3aXRob3V0IGVtcGxveWVlIG51bWJlclxuICAgICAgICAgICAgaWYgKG1vZGVsLmVtcGxveWVlTnVtYmVyID09PSBudWxsIHx8IG1vZGVsLmVtcGxveWVlTnVtYmVyID09PSAnJykge1xuICAgICAgICAgICAgICAgIGludmFsaWRSZWNvcmRzLnB1c2gobW9kZWwpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpc0R1cGxpY2F0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjbGVhblJlY29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY2xlYXJSZWNvcmQgOiBLUEFVc2VyTW9kZWwgPSBjbGVhblJlY29yZHNbaV07XG4gICAgICAgICAgICAgICAgaWYgKGNsZWFyUmVjb3JkLnVzZXJuYW1lID09PSBtb2RlbC51c2VybmFtZSB8fCBjbGVhclJlY29yZC5lbXBsb3llZU51bWJlciA9PT0gbW9kZWwuZW1wbG95ZWVOdW1iZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNEdXBsaWNhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpbnZhbGlkUmVjb3Jkcy5wdXNoKG1vZGVsKVxuICAgICAgICAgICAgICAgICAgICBpbnZhbGlkUmVjb3Jkcy5wdXNoKGNsZWFyUmVjb3JkKVxuICAgICAgICAgICAgICAgICAgICBjbGVhblJlY29yZHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghaXNEdXBsaWNhdGUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpbnZhbGlkUmVjb3JkIG9mIGludmFsaWRSZWNvcmRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnZhbGlkUmVjb3JkLnVzZXJuYW1lID09PSBtb2RlbC51c2VybmFtZSB8fCBpbnZhbGlkUmVjb3JkLmVtcGxveWVlTnVtYmVyID09PSBtb2RlbC5lbXBsb3llZU51bWJlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNEdXBsaWNhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW52YWxpZFJlY29yZHMucHVzaChtb2RlbClcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWlzRHVwbGljYXRlKSB7XG4gICAgICAgICAgICAgICAgY2xlYW5SZWNvcmRzLnB1c2gobW9kZWwpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2xlYW5SZWNvcmRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuI3NlbmREYXRhVG9LUEEoc2l0ZSwgY2xlYW5SZWNvcmRzLCBpc0VkaXRVU2VyKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGludmFsaWRSZWNvcmRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuI3NlbmREYXRhVG9LUEEoc2l0ZSwgaW52YWxpZFJlY29yZHMsIGlzRWRpdFVTZXIpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBhc3luYyAjc2VuZERhdGFUb0tQQShzaXRlOiBzdHJpbmcsIG1vZGVsczogS1BBVXNlck1vZGVsW10sIGlzRWRpdFVTZXI6IGJvb2xlYW4pIDogUHJvbWlzZTxib29sZWFuPiB7XG5cbiAgICAgICAgbGV0IGhlYWRlcnMgPSAnJztcbiAgICAgICAgaWYgKGlzRWRpdFVTZXIpIHtcbiAgICAgICAgICAgIGhlYWRlcnMgPSAnU2l0ZSxSZWNvcmRUeXBlLEVtcGxveWVlTnVtYmVyLEZpcnN0TmFtZSxMYXN0TmFtZSxVc2VybmFtZSxJbml0aWFsUGFzc3dvcmQsUm9sZSxUaXRsZSxFbWFpbCxUZXJtaW5hdGlvbkRhdGUsRm9yY2VQYXNzd29yZFNlbGVjdGlvbixTZW5kV2VsY29tZUVtYWlsLFVwZGF0ZVBvbGljeSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBoZWFkZXJzID0gJ1NpdGUsUmVjb3JkVHlwZSxFbXBsb3llZU51bWJlcixGaXJzdE5hbWUsTGFzdE5hbWUsVXNlcm5hbWUsSW5pdGlhbFBhc3N3b3JkLFJvbGUsVGl0bGUsRW1haWwsVGVybWluYXRpb25EYXRlLEZvcmNlUGFzc3dvcmRTZWxlY3Rpb24sU2VuZFdlbGNvbWVFbWFpbCc7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY29udGVudCA9IGAke2hlYWRlcnN9YDtcblxuICAgICAgICBmb3IodmFyIG1vZGVsIG9mIG1vZGVscykge1xuXG4gICAgICAgICAgICB2YXIgZGF0YVVzZXIgPSBgJHtzaXRlfSxFbXBsb3llZWBcbiAgICAgICAgICAgIGRhdGFVc2VyID0gYCR7ZGF0YVVzZXJ9LCR7SGVscGVyLmNzdkNvbnRlbnRDaGVja2VyKG1vZGVsLmVtcGxveWVlTnVtYmVyKX1gXG4gICAgICAgICAgICBkYXRhVXNlciA9IGAke2RhdGFVc2VyfSwke0hlbHBlci5jc3ZDb250ZW50Q2hlY2tlcihtb2RlbC5maXJzdE5hbWUpfWBcbiAgICAgICAgICAgIGRhdGFVc2VyID0gYCR7ZGF0YVVzZXJ9LCR7SGVscGVyLmNzdkNvbnRlbnRDaGVja2VyKG1vZGVsLmxhc3ROYW1lKX1gXG4gICAgICAgICAgICBkYXRhVXNlciA9IGAke2RhdGFVc2VyfSwke0hlbHBlci5jc3ZDb250ZW50Q2hlY2tlcihtb2RlbC51c2VybmFtZSl9YFxuICAgICAgICAgICAgZGF0YVVzZXIgPSBgJHtkYXRhVXNlcn0sJHtIZWxwZXIuY3N2Q29udGVudENoZWNrZXIobW9kZWwuaW5pdGlhbFBhc3N3b3JkKX1gXG4gICAgICAgICAgICBkYXRhVXNlciA9IGAke2RhdGFVc2VyfSwke0hlbHBlci5jc3ZDb250ZW50Q2hlY2tlcihtb2RlbC5yb2xlKX1gXG4gICAgICAgICAgICBkYXRhVXNlciA9IGAke2RhdGFVc2VyfSwke0hlbHBlci5jc3ZDb250ZW50Q2hlY2tlcihtb2RlbC50aXRsZSl9YFxuICAgICAgICAgICAgZGF0YVVzZXIgPSBgJHtkYXRhVXNlcn0sJHtIZWxwZXIuY3N2Q29udGVudENoZWNrZXIobW9kZWwuZW1haWwpfWBcbiAgICAgICAgICAgIGRhdGFVc2VyID0gYCR7ZGF0YVVzZXJ9LCR7SGVscGVyLmNzdkNvbnRlbnRDaGVja2VyKG1vZGVsLnRlcm1pbmF0aW9uRGF0ZSA/PyAnJyl9YFxuICAgICAgICAgICAgZGF0YVVzZXIgPSBgJHtkYXRhVXNlcn0sJHttb2RlbC5yZXNldFBhc3N3b3JkID8gJ1knOiAnTid9YFxuICAgICAgICAgICAgZGF0YVVzZXIgPSBgJHtkYXRhVXNlcn0sJHttb2RlbC53ZWxjb21lRW1haWwgPyAnWSc6ICdOJ31gXG5cbiAgICAgICAgICAgIGlmIChpc0VkaXRVU2VyKSB7XG4gICAgICAgICAgICAgICAgZGF0YVVzZXIgPSBgJHtkYXRhVXNlcn0sQWx3YXlzYFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb250ZW50ID0gYCR7Y29udGVudH1cXG4ke2RhdGFVc2VyfWBcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZpbGVEYXRhID0gQnVmZmVyLmZyb20oY29udGVudCwgJ2JpbmFyeScpLnRvU3RyaW5nKCdiYXNlNjQnKTtcblxuICAgICAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuYXBpSW5zdGFuY2UucG9zdCgnZGF0YWxvYWQuY3JlYXRlJywge1xuICAgICAgICAgICAgdG9rZW46dGhpcy50b2tlbixcbiAgICAgICAgICAgIGZpbGU6IGBkYXRhOnRleHQvY3N2O2Jhc2U2NCwke2ZpbGVEYXRhfWAsXG4gICAgICAgICAgICBuYW1lOiAnZW1wbG95ZWVzLmNzdicsXG4gICAgICAgICAgICBmYWlsdXJlRW1haWxzOiBbXSxcbiAgICAgICAgICAgIHN1Y2Nlc3NFbWFpbHM6IFtdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlYnVnbG9nKCdsb2c6d29ya2VyOmRhdGFsb2FkLXJlc3BvbnNlJykoJ3Byb2NvcmUuZW1wbG95ZWVzJywgZGF0YSlcbiAgICAgICAgaWYgKCFkYXRhLm9rKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZGF0YS5lcnJvcn06JHtkYXRhLmRlc2NyaXB0aW9ufWApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRhdGEub2s7XG4gICAgfVxuXG59Il19
