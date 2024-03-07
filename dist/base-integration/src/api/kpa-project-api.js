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
class KPAProjectAPI {
    constructor(token) {
        _KPAProjectAPI_instances.add(this);
        this.token = token;
        this.apiInstance = axios_1.default.create({ baseURL: 'https://api.kpaehs.com/v1' });
    }
    async getAllProject() {
        let result = [];
        const { data } = await this.apiInstance.post('projects.list', { token: this.token });
        console.log(data);
        for (var projectData of data) {
            let project = Object.assign(new model_1.KPAProjectModel(), projectData);
            result.push(project);
        }
        return result;
    }
    async saveProject(site, models) {
        var clearRecords = [];
        var duplicateRecords = [];
        for (var model of models) {
            var isDuplicate = false;
            for (let i = 0; i < clearRecords.length; i++) {
                var clearRecord = clearRecords[i];
                if (clearRecord.code === model.code) {
                    isDuplicate = true;
                    duplicateRecords.push(model);
                    duplicateRecords.push(clearRecord);
                    clearRecords.splice(i, 1);
                    break;
                }
            }
            if (!isDuplicate) {
                for (var duplicateRecord of duplicateRecords) {
                    if (duplicateRecord.code === model.code) {
                        isDuplicate = true;
                        duplicateRecords.push(model);
                        break;
                    }
                }
            }
            if (!isDuplicate) {
                clearRecords.push(model);
            }
        }
        if (clearRecords.length > 0) {
            await __classPrivateFieldGet(this, _KPAProjectAPI_instances, "m", _KPAProjectAPI_sendDataToKPA).call(this, site, clearRecords);
        }
        if (duplicateRecords.length > 0) {
            await __classPrivateFieldGet(this, _KPAProjectAPI_instances, "m", _KPAProjectAPI_sendDataToKPA).call(this, site, duplicateRecords);
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
        failureEmails: [],
        successEmails: []
    });
    console.log(data);
    return data.ok;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3BhLXByb2plY3QtYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvYXBpL2twYS1wcm9qZWN0LWFwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxpQ0FBcUM7QUFDckMsb0NBQTJDO0FBQzNDLDRDQUFzQztBQUd0QyxNQUFhLGFBQWE7SUFJdEIsWUFBWSxLQUFhOztRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsV0FBVyxHQUFHLGVBQUssQ0FBQyxNQUFNLENBQUMsRUFBQyxPQUFPLEVBQUUsMkJBQTJCLEVBQUMsQ0FBQyxDQUFBO0lBQzNFLENBQUM7SUFFRCxLQUFLLENBQUMsYUFBYTtRQUNmLElBQUksTUFBTSxHQUF1QixFQUFFLENBQUM7UUFDcEMsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLEVBQUMsS0FBSyxFQUFDLElBQUksQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDO1FBQ2xGLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDakIsS0FBSyxJQUFJLFdBQVcsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUMzQixJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksdUJBQWUsRUFBRSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ2hFLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxLQUFLLENBQUMsV0FBVyxDQUFDLElBQVksRUFBRSxNQUF5QjtRQUVyRCxJQUFJLFlBQVksR0FBdUIsRUFBRSxDQUFBO1FBQ3pDLElBQUksZ0JBQWdCLEdBQXVCLEVBQUUsQ0FBQTtRQUU3QyxLQUFLLElBQUksS0FB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QUMvRCxPQUFPLEdBQUcsR0FBRyxPQUFPLElBQUksa0JBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQTtJQUVqRSxDQUFDO0lBRUQsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRW5FLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFO1FBQzVELEtBQUssRUFBQyxJQUFJLENBQUMsS0FBSztRQUNoQixJQUFJLEVBQUUsd0JBQXdCLFFBQVEsRUFBRTtRQUN4QyxhQUFhLEVBQUUsRUFBRTtRQUNqQixhQUFhLEVBQUUsRUFBRTtLQUNwQixDQUFDLENBQUM7SUFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBRWpCLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUNuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF4aW9zLCB7IEF4aW9zIH0gZnJvbSBcImF4aW9zXCI7XG5pbXBvcnQgeyBLUEFQcm9qZWN0TW9kZWwgfSBmcm9tIFwiLi4vbW9kZWxcIjtcbmltcG9ydCB7IEhlbHBlciB9IGZyb20gXCIuLi91dGlsaXRpZXNcIjtcbmltcG9ydCB7IGNsZWFyIH0gZnJvbSBcImNvbnNvbGVcIjtcblxuZXhwb3J0IGNsYXNzIEtQQVByb2plY3RBUEkge1xuICAgIHRva2VuOiBzdHJpbmc7XG4gICAgYXBpSW5zdGFuY2U6IEF4aW9zO1xuXG4gICAgY29uc3RydWN0b3IodG9rZW46IHN0cmluZykge1xuICAgICAgICB0aGlzLnRva2VuID0gdG9rZW47XG4gICAgICAgIHRoaXMuYXBpSW5zdGFuY2UgPSBheGlvcy5jcmVhdGUoe2Jhc2VVUkw6ICdodHRwczovL2FwaS5rcGFlaHMuY29tL3YxJ30pXG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0QWxsUHJvamVjdCgpOlByb21pc2U8S1BBUHJvamVjdE1vZGVsW10+IHtcbiAgICAgICAgbGV0IHJlc3VsdCA6IEtQQVByb2plY3RNb2RlbFtdID0gW107XG4gICAgICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy5hcGlJbnN0YW5jZS5wb3N0KCdwcm9qZWN0cy5saXN0Jywge3Rva2VuOnRoaXMudG9rZW59KTtcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSlcbiAgICAgICAgZm9yICh2YXIgcHJvamVjdERhdGEgb2YgZGF0YSkge1xuICAgICAgICAgICAgbGV0IHByb2plY3QgPSBPYmplY3QuYXNzaWduKG5ldyBLUEFQcm9qZWN0TW9kZWwoKSwgcHJvamVjdERhdGEpO1xuICAgICAgICAgICAgcmVzdWx0LnB1c2gocHJvamVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBhc3luYyBzYXZlUHJvamVjdChzaXRlOiBzdHJpbmcsIG1vZGVsczogS1BBUHJvamVjdE1vZGVsW10pIDogUHJvbWlzZTxib29sZWFuPiB7XG5cbiAgICAgICAgdmFyIGNsZWFyUmVjb3JkcyA6IEtQQVByb2plY3RNb2RlbFtdID0gW11cbiAgICAgICAgdmFyIGR1cGxpY2F0ZVJlY29yZHMgOiBLUEFQcm9qZWN0TW9kZWxbXSA9IFtdXG5cbiAgICAgICAgZm9yICh2YXIgbW9kZWwgb2YgbW9kZWxzKSB7XG4gICAgICAgICAgICB2YXIgaXNEdXBsaWNhdGUgPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2xlYXJSZWNvcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNsZWFyUmVjb3JkIDogS1BBUHJvamVjdE1vZGVsID0gY2xlYXJSZWNvcmRzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChjbGVhclJlY29yZC5jb2RlID09PSBtb2RlbC5jb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzRHVwbGljYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgZHVwbGljYXRlUmVjb3Jkcy5wdXNoKG1vZGVsKVxuICAgICAgICAgICAgICAgICAgICBkdXBsaWNhdGVSZWNvcmRzLnB1c2goY2xlYXJSZWNvcmQpXG4gICAgICAgICAgICAgICAgICAgIGNsZWFyUmVjb3Jkcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFpc0R1cGxpY2F0ZSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGR1cGxpY2F0ZVJlY29yZCBvZiBkdXBsaWNhdGVSZWNvcmRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkdXBsaWNhdGVSZWNvcmQuY29kZSA9PT0gbW9kZWwuY29kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNEdXBsaWNhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZHVwbGljYXRlUmVjb3Jkcy5wdXNoKG1vZGVsKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghaXNEdXBsaWNhdGUpIHtcbiAgICAgICAgICAgICAgICBjbGVhclJlY29yZHMucHVzaChtb2RlbClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjbGVhclJlY29yZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy4jc2VuZERhdGFUb0tQQShzaXRlLCBjbGVhclJlY29yZHMpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZHVwbGljYXRlUmVjb3Jkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLiNzZW5kRGF0YVRvS1BBKHNpdGUsIGR1cGxpY2F0ZVJlY29yZHMpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTsgICAgICAgIFxuICAgIH1cblxuICAgIGFzeW5jICNzZW5kRGF0YVRvS1BBKHNpdGU6IHN0cmluZywgbW9kZWxzOiBLUEFQcm9qZWN0TW9kZWxbXSkgOiBQcm9taXNlPGJvb2xlYW4+IHtcblxuICAgICAgICBsZXQgaGVhZGVycyA9ICdTaXRlLFJlY29yZFR5cGUsTmFtZSxOdW1iZXIsSXNBY3RpdmUsQWRkcmVzcyxDaXR5LFN0YXRlLFpJUCc7XG4gICAgICAgIHZhciBjb250ZW50ID0gYCR7aGVhZGVyc31gO1xuICAgICAgICBmb3IodmFyIG1vZGVsIG9mIG1vZGVscykge1xuXG4gICAgICAgICAgICBjb250ZW50ID0gYCR7Y29udGVudH1cXG4ke3NpdGV9LFByb2plY3RgXG4gICAgICAgICAgICBjb250ZW50ID0gYCR7Y29udGVudH0sJHtIZWxwZXIuY3N2Q29udGVudENoZWNrZXIobW9kZWwubmFtZSl9YFxuICAgICAgICAgICAgY29udGVudCA9IGAke2NvbnRlbnR9LCR7SGVscGVyLmNzdkNvbnRlbnRDaGVja2VyKG1vZGVsLmNvZGUpfWBcbiAgICAgICAgICAgIGNvbnRlbnQgPSBgJHtjb250ZW50fSwke21vZGVsLmlzQWN0aXZlID8gJ1knOidOJ31gXG4gICAgICAgICAgICBjb250ZW50ID0gYCR7Y29udGVudH0sJHtIZWxwZXIuY3N2Q29udGVudENoZWNrZXIobW9kZWwuYWRkcmVzcyl9YFxuICAgICAgICAgICAgY29udGVudCA9IGAke2NvbnRlbnR9LCR7SGVscGVyLmNzdkNvbnRlbnRDaGVja2VyKG1vZGVsLmNpdHkpfWBcbiAgICAgICAgICAgIGNvbnRlbnQgPSBgJHtjb250ZW50fSwke0hlbHBlci5jc3ZDb250ZW50Q2hlY2tlcihtb2RlbC5zdGF0ZSl9YFxuICAgICAgICAgICAgY29udGVudCA9IGAke2NvbnRlbnR9LCR7SGVscGVyLmNzdkNvbnRlbnRDaGVja2VyKG1vZGVsLnppcCl9YFxuICAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaWxlRGF0YSA9IEJ1ZmZlci5mcm9tKGNvbnRlbnQsICdiaW5hcnknKS50b1N0cmluZygnYmFzZTY0Jyk7XG5cbiAgICAgICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLmFwaUluc3RhbmNlLnBvc3QoJ2RhdGFsb2FkLmNyZWF0ZScsIHtcbiAgICAgICAgICAgIHRva2VuOnRoaXMudG9rZW4sXG4gICAgICAgICAgICBmaWxlOiBgZGF0YTp0ZXh0L2NzdjtiYXNlNjQsJHtmaWxlRGF0YX1gLFxuICAgICAgICAgICAgZmFpbHVyZUVtYWlsczogW10sXG4gICAgICAgICAgICBzdWNjZXNzRW1haWxzOiBbXVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKVxuXG4gICAgICAgIHJldHVybiBkYXRhLm9rO1xuICAgIH1cblxufSJdfQ==