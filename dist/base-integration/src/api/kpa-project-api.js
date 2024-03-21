"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _KPAProjectAPI_instances, _KPAProjectAPI_sendDataToKPA;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KPAProjectAPI = void 0;
const axios_1 = require("axios");
const model_1 = require("../model");
const utilities_1 = require("../utilities");
const util_1 = require("util");
class KPAProjectAPI {
    constructor(token) {
        _KPAProjectAPI_instances.add(this);
        this.token = token;
        this.apiInstance = axios_1.default.create({ baseURL: 'https://api.kpaehs.com/v1' });
    }
    async getAllProject() {
        let result = [];
        const { data } = await this.apiInstance.post('projects.list', { token: this.token });
        (0, util_1.debuglog)('log:base:projects')(data);
        for (var projectData of data) {
            let project = Object.assign(new model_1.KPAProjectModel(), projectData);
            result.push(project);
        }
        return result;
    }
    async saveProject(site, models) {
        var cleanRecords = [];
        var invalidRecords = [];
        for (var model of models) {
            //Ignore Project without job number
            if (model.code === null || model.code === '') {
                invalidRecords.push(model);
                continue;
            }
            var isDuplicate = false;
            for (let i = 0; i < cleanRecords.length; i++) {
                var clearRecord = cleanRecords[i];
                if (clearRecord.code === model.code) {
                    isDuplicate = true;
                    invalidRecords.push(model);
                    invalidRecords.push(clearRecord);
                    cleanRecords.splice(i, 1);
                    break;
                }
            }
            if (!isDuplicate) {
                for (var invalidRecord of invalidRecords) {
                    if (invalidRecord.code === model.code) {
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
            await __classPrivateFieldGet(this, _KPAProjectAPI_instances, "m", _KPAProjectAPI_sendDataToKPA).call(this, site, cleanRecords);
        }
        if (invalidRecords.length > 0) {
            await __classPrivateFieldGet(this, _KPAProjectAPI_instances, "m", _KPAProjectAPI_sendDataToKPA).call(this, site, invalidRecords);
        }
        return true;
    }
}
exports.KPAProjectAPI = KPAProjectAPI;
_KPAProjectAPI_instances = new WeakSet(), _KPAProjectAPI_sendDataToKPA = async function _KPAProjectAPI_sendDataToKPA(site, models) {
    let headers = 'Site,RecordType,Name,Number,IsActive,Address,City,State,ZIP';
    var content = `${headers}`;
    for (var model of models) {
        content = `${content}\n${site},Project`;
        content = `${content},${utilities_1.Helper.csvContentChecker(model.name)}`;
        content = `${content},${utilities_1.Helper.csvContentChecker(model.code)}`;
        content = `${content},${model.isActive ? 'Y' : 'N'}`;
        content = `${content},${utilities_1.Helper.csvContentChecker(model.address)}`;
        content = `${content},${utilities_1.Helper.csvContentChecker(model.city)}`;
        content = `${content},${utilities_1.Helper.csvContentChecker(model.state)}`;
        content = `${content},${utilities_1.Helper.csvContentChecker(model.zip)}`;
    }
    const fileData = Buffer.from(content, 'binary').toString('base64');
    const { data } = await this.apiInstance.post('dataload.create', {
        token: this.token,
        file: `data:text/csv;base64,${fileData}`,
        name: 'procore.projects',
        failureEmails: [],
        successEmails: []
    });
    (0, util_1.debuglog)('log:worker:dataload-response')('procore.employees', data);
    return data.ok;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3BhLXByb2plY3QtYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvYXBpL2twYS1wcm9qZWN0LWFwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxpQ0FBcUM7QUFDckMsb0NBQTJDO0FBQzNDLDRDQUFzQztBQUN0QywrQkFBZ0M7QUFFaEMsTUFBYSxhQUFhO0lBSXRCLFlBQVksS0FBYTs7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxlQUFLLENBQUMsTUFBTSxDQUFDLEVBQUMsT0FBTyxFQUFFLDJCQUEyQixFQUFDLENBQUMsQ0FBQTtJQUMzRSxDQUFDO0lBRUQsS0FBSyxDQUFDLGFBQWE7UUFDZixJQUFJLE1BQU0sR0FBdUIsRUFBRSxDQUFDO1FBQ3BDLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFDLEtBQUssRUFBQyxJQUFJLENBQUMsS0FBSyxFQUFDLENBQUMsQ0FBQztRQUNsRixJQUFBLGVBQVEsRUFBQyxtQkFBbUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ25DLEtBQUssSUFBSSxXQUFXLElBQUksSUFBSSxFQUFFLENBQUM7WUFDM0IsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLHVCQUFlLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUNoRSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pCLENBQUM7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRUQsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFZLEVBQUUsTUFBeUI7UUFFckQsSUFBSSxZQUFZLEdBQXVCLEVBQUUsQ0FBQTtRQUN6QyxJQUFJLGNBQWMsR0FBdUIsRUFBRSxD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T0FBTyxHQUFHLEdBQUcsT0FBTyxJQUFJLGtCQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUE7UUFDOUQsT0FBTyxHQUFHLEdBQUcsT0FBTyxJQUFJLGtCQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUE7UUFDL0QsT0FBTyxHQUFHLEdBQUcsT0FBTyxJQUFJLGtCQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUE7SUFFakUsQ0FBQztJQUVELE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUVuRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtRQUM1RCxLQUFLLEVBQUMsSUFBSSxDQUFDLEtBQUs7UUFDaEIsSUFBSSxFQUFFLHdCQUF3QixRQUFRLEVBQUU7UUFDeEMsSUFBSSxFQUFFLGtCQUFrQjtRQUN4QixhQUFhLEVBQUUsRUFBRTtRQUNqQixhQUFhLEVBQUUsRUFBRTtLQUNwQixDQUFDLENBQUM7SUFFSCxJQUFBLGVBQVEsRUFBQyw4QkFBOEIsQ0FBQyxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFBO0lBRW5FLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUNuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF4aW9zLCB7IEF4aW9zIH0gZnJvbSBcImF4aW9zXCI7XG5pbXBvcnQgeyBLUEFQcm9qZWN0TW9kZWwgfSBmcm9tIFwiLi4vbW9kZWxcIjtcbmltcG9ydCB7IEhlbHBlciB9IGZyb20gXCIuLi91dGlsaXRpZXNcIjtcbmltcG9ydCB7IGRlYnVnbG9nIH0gZnJvbSAndXRpbCc7XG5cbmV4cG9ydCBjbGFzcyBLUEFQcm9qZWN0QVBJIHtcbiAgICB0b2tlbjogc3RyaW5nO1xuICAgIGFwaUluc3RhbmNlOiBBeGlvcztcblxuICAgIGNvbnN0cnVjdG9yKHRva2VuOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuO1xuICAgICAgICB0aGlzLmFwaUluc3RhbmNlID0gYXhpb3MuY3JlYXRlKHtiYXNlVVJMOiAnaHR0cHM6Ly9hcGkua3BhZWhzLmNvbS92MSd9KVxuICAgIH1cblxuICAgIGFzeW5jIGdldEFsbFByb2plY3QoKTpQcm9taXNlPEtQQVByb2plY3RNb2RlbFtdPiB7XG4gICAgICAgIGxldCByZXN1bHQgOiBLUEFQcm9qZWN0TW9kZWxbXSA9IFtdO1xuICAgICAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuYXBpSW5zdGFuY2UucG9zdCgncHJvamVjdHMubGlzdCcsIHt0b2tlbjp0aGlzLnRva2VufSk7XG4gICAgICAgIGRlYnVnbG9nKCdsb2c6YmFzZTpwcm9qZWN0cycpKGRhdGEpXG4gICAgICAgIGZvciAodmFyIHByb2plY3REYXRhIG9mIGRhdGEpIHtcbiAgICAgICAgICAgIGxldCBwcm9qZWN0ID0gT2JqZWN0LmFzc2lnbihuZXcgS1BBUHJvamVjdE1vZGVsKCksIHByb2plY3REYXRhKTtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHByb2plY3QpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgYXN5bmMgc2F2ZVByb2plY3Qoc2l0ZTogc3RyaW5nLCBtb2RlbHM6IEtQQVByb2plY3RNb2RlbFtdKSA6IFByb21pc2U8Ym9vbGVhbj4ge1xuXG4gICAgICAgIHZhciBjbGVhblJlY29yZHMgOiBLUEFQcm9qZWN0TW9kZWxbXSA9IFtdXG4gICAgICAgIHZhciBpbnZhbGlkUmVjb3JkcyA6IEtQQVByb2plY3RNb2RlbFtdID0gW11cblxuICAgICAgICBmb3IgKHZhciBtb2RlbCBvZiBtb2RlbHMpIHtcblxuICAgICAgICAgICAgLy9JZ25vcmUgUHJvamVjdCB3aXRob3V0IGpvYiBudW1iZXJcbiAgICAgICAgICAgIGlmIChtb2RlbC5jb2RlID09PSBudWxsIHx8IG1vZGVsLmNvZGUgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgaW52YWxpZFJlY29yZHMucHVzaChtb2RlbClcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaXNEdXBsaWNhdGUgPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2xlYW5SZWNvcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNsZWFyUmVjb3JkIDogS1BBUHJvamVjdE1vZGVsID0gY2xlYW5SZWNvcmRzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChjbGVhclJlY29yZC5jb2RlID09PSBtb2RlbC5jb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzRHVwbGljYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaW52YWxpZFJlY29yZHMucHVzaChtb2RlbClcbiAgICAgICAgICAgICAgICAgICAgaW52YWxpZFJlY29yZHMucHVzaChjbGVhclJlY29yZClcbiAgICAgICAgICAgICAgICAgICAgY2xlYW5SZWNvcmRzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWlzRHVwbGljYXRlKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaW52YWxpZFJlY29yZCBvZiBpbnZhbGlkUmVjb3Jkcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW52YWxpZFJlY29yZC5jb2RlID09PSBtb2RlbC5jb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0R1cGxpY2F0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZhbGlkUmVjb3Jkcy5wdXNoKG1vZGVsKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghaXNEdXBsaWNhdGUpIHtcbiAgICAgICAgICAgICAgICBjbGVhblJlY29yZHMucHVzaChtb2RlbClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjbGVhblJlY29yZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy4jc2VuZERhdGFUb0tQQShzaXRlLCBjbGVhblJlY29yZHMpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW52YWxpZFJlY29yZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy4jc2VuZERhdGFUb0tQQShzaXRlLCBpbnZhbGlkUmVjb3JkcylcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGFzeW5jICNzZW5kRGF0YVRvS1BBKHNpdGU6IHN0cmluZywgbW9kZWxzOiBLUEFQcm9qZWN0TW9kZWxbXSkgOiBQcm9taXNlPGJvb2xlYW4+IHtcblxuICAgICAgICBsZXQgaGVhZGVycyA9ICdTaXRlLFJlY29yZFR5cGUsTmFtZSxOdW1iZXIsSXNBY3RpdmUsQWRkcmVzcyxDaXR5LFN0YXRlLFpJUCc7XG4gICAgICAgIHZhciBjb250ZW50ID0gYCR7aGVhZGVyc31gO1xuICAgICAgICBmb3IodmFyIG1vZGVsIG9mIG1vZGVscykge1xuXG4gICAgICAgICAgICBjb250ZW50ID0gYCR7Y29udGVudH1cXG4ke3NpdGV9LFByb2plY3RgXG4gICAgICAgICAgICBjb250ZW50ID0gYCR7Y29udGVudH0sJHtIZWxwZXIuY3N2Q29udGVudENoZWNrZXIobW9kZWwubmFtZSl9YFxuICAgICAgICAgICAgY29udGVudCA9IGAke2NvbnRlbnR9LCR7SGVscGVyLmNzdkNvbnRlbnRDaGVja2VyKG1vZGVsLmNvZGUpfWBcbiAgICAgICAgICAgIGNvbnRlbnQgPSBgJHtjb250ZW50fSwke21vZGVsLmlzQWN0aXZlID8gJ1knOidOJ31gXG4gICAgICAgICAgICBjb250ZW50ID0gYCR7Y29udGVudH0sJHtIZWxwZXIuY3N2Q29udGVudENoZWNrZXIobW9kZWwuYWRkcmVzcyl9YFxuICAgICAgICAgICAgY29udGVudCA9IGAke2NvbnRlbnR9LCR7SGVscGVyLmNzdkNvbnRlbnRDaGVja2VyKG1vZGVsLmNpdHkpfWBcbiAgICAgICAgICAgIGNvbnRlbnQgPSBgJHtjb250ZW50fSwke0hlbHBlci5jc3ZDb250ZW50Q2hlY2tlcihtb2RlbC5zdGF0ZSl9YFxuICAgICAgICAgICAgY29udGVudCA9IGAke2NvbnRlbnR9LCR7SGVscGVyLmNzdkNvbnRlbnRDaGVja2VyKG1vZGVsLnppcCl9YFxuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaWxlRGF0YSA9IEJ1ZmZlci5mcm9tKGNvbnRlbnQsICdiaW5hcnknKS50b1N0cmluZygnYmFzZTY0Jyk7XG5cbiAgICAgICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLmFwaUluc3RhbmNlLnBvc3QoJ2RhdGFsb2FkLmNyZWF0ZScsIHtcbiAgICAgICAgICAgIHRva2VuOnRoaXMudG9rZW4sXG4gICAgICAgICAgICBmaWxlOiBgZGF0YTp0ZXh0L2NzdjtiYXNlNjQsJHtmaWxlRGF0YX1gLFxuICAgICAgICAgICAgbmFtZTogJ3Byb2NvcmUucHJvamVjdHMnLFxuICAgICAgICAgICAgZmFpbHVyZUVtYWlsczogW10sXG4gICAgICAgICAgICBzdWNjZXNzRW1haWxzOiBbXVxuICAgICAgICB9KTtcblxuICAgICAgICBkZWJ1Z2xvZygnbG9nOndvcmtlcjpkYXRhbG9hZC1yZXNwb25zZScpKCdwcm9jb3JlLmVtcGxveWVlcycsIGRhdGEpXG5cbiAgICAgICAgcmV0dXJuIGRhdGEub2s7XG4gICAgfVxuXG59Il19