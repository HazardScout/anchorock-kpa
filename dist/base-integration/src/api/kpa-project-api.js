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
        failureEmails: [],
        successEmails: []
    });
    console.log(data);
    return data.ok;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3BhLXByb2plY3QtYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvYXBpL2twYS1wcm9qZWN0LWFwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxpQ0FBcUM7QUFDckMsb0NBQTJDO0FBQzNDLDRDQUFzQztBQUd0QyxNQUFhLGFBQWE7SUFJdEIsWUFBWSxLQUFhOztRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsV0FBVyxHQUFHLGVBQUssQ0FBQyxNQUFNLENBQUMsRUFBQyxPQUFPLEVBQUUsMkJBQTJCLEVBQUMsQ0FBQyxDQUFBO0lBQzNFLENBQUM7SUFFRCxLQUFLLENBQUMsYUFBYTtRQUNmLElBQUksTUFBTSxHQUF1QixFQUFFLENBQUM7UUFDcEMsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLEVBQUMsS0FBSyxFQUFDLElBQUksQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDO1FBQ2xGLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDakIsS0FBSyxJQUFJLFdBQVcsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUMzQixJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksdUJBQWUsRUFBRSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ2hFLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxLQUFLLENBQUMsV0FBVyxDQUFDLElBQVksRUFBRSxNQUF5QjtRQUVyRCxJQUFJLFlBQVksR0FBdUIsRUFBRSxDQUFBO1FBQ3pDLElBQUksY0FBYyxHQUF1QixFQUFFLENBQUE7UUFFM0MsS0FBSyxJQUFJLEtBQUssSUFBSSxNQUFNLEVBQUUsQ0FBQztZQUV2QixtQ0FBbUM7WUFDbkMsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLEVBQUUsRUFBRSxDQUFDO2dCQUMzQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUMxQixTQUFRO1lBQ1osQ0FBQztZQUVELElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQztZQUN4QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUMzQyxJQUFJLFdBQVcsR0FBcUIsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwRCxJQUFJLFdBQVcsQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNsQyxXQUFXLEdBQUcsSUFBSSxDQUFDO29CQUNuQixjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO29CQUMxQixjQUFjLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO29CQUNoQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDMUIsTUFBTTtnQkFDVixDQUFDO1lBQ0wsQ0FBQztZQUVELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDZixLQUFLLElBQUksYUFBYSxJQUFJLGNBQWMsRUFBRSxDQUFDO29CQUN2QyxJQUFJLGFBQWEsQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO3dCQUNwQyxXQUFXLEdBQUcsSUFBSSxDQUFDO3dCQUNuQixjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO3dCQUMxQixNQUFNO29CQUNWLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7WUFFRCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ2YsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUM1QixDQUFDO1FBQ0wsQ0FBQztRQUVELElBQUksWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUMxQixNQUFNLHVCQUFBLElBQUksOERBQWUsTUFBbkIsSUFBSSxFQUFnQixJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUE7UUFDakQsQ0FBQztRQUVELElBQUksY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUM1QixNQUFNLHVCQUFBLElBQUksOERBQWUsTUFBbkIsSUFBSSxFQUFnQixJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUE7UUFDbkQsQ0FBQztRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FpQ0o7QUF0R0Qsc0NBc0dDO3lFQS9CRyxLQUFLLHVDQUFnQixJQUFZLEVBQUUsTUFBeUI7SUFFeEQsSUFBSSxPQUFPLEdBQUcsNkRBQTZELENBQUM7SUFDNUUsSUFBSSxPQUFPLEdBQUcsR0FBRyxPQUFPLEVBQUUsQ0FBQztJQUMzQixLQUFJLElBQUksS0FBSyxJQUFJLE1BQU0sRUFBRSxDQUFDO1FBRXRCLE9BQU8sR0FBRyxHQUFHLE9BQU8sS0FBSyxJQUFJLFVBQVUsQ0FBQTtRQUN2QyxPQUFPLEdBQUcsR0FBRyxPQUFPLElBQUksa0JBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQTtRQUM5RCxPQUFPLEdBQUcsR0FBRyxPQUFPLElBQUksa0JBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQTtRQUM5RCxPQUFPLEdBQUcsR0FBRyxPQUFPLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFBLENBQUMsQ0FBQSxHQUFHLEVBQUUsQ0FBQTtRQUNsRCxPQUFPLEdBQUcsR0FBRyxPQUFPLElBQUksa0JBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQTtRQUNqRSxPQUFPLEdBQUcsR0FBRyxPQUFPLElBQUksa0JBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQTtRQUM5RCxPQUFPLEdBQUcsR0FBRyxPQUFPLElBQUksa0JBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQTtRQUMvRCxPQUFPLEdBQUcsR0FBRyxPQUFPLElBQUksa0JBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQTtJQUVqRSxDQUFDO0lBRUQsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRW5FLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFO1FBQzVELEtBQUssRUFBQyxJQUFJLENBQUMsS0FBSztRQUNoQixJQUFJLEVBQUUsd0JBQXdCLFFBQVEsRUFBRTtRQUN4QyxhQUFhLEVBQUUsRUFBRTtRQUNqQixhQUFhLEVBQUUsRUFBRTtLQUNwQixDQUFDLENBQUM7SUFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBRWpCLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUNuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF4aW9zLCB7IEF4aW9zIH0gZnJvbSBcImF4aW9zXCI7XG5pbXBvcnQgeyBLUEFQcm9qZWN0TW9kZWwgfSBmcm9tIFwiLi4vbW9kZWxcIjtcbmltcG9ydCB7IEhlbHBlciB9IGZyb20gXCIuLi91dGlsaXRpZXNcIjtcbmltcG9ydCB7IGNsZWFyIH0gZnJvbSBcImNvbnNvbGVcIjtcblxuZXhwb3J0IGNsYXNzIEtQQVByb2plY3RBUEkge1xuICAgIHRva2VuOiBzdHJpbmc7XG4gICAgYXBpSW5zdGFuY2U6IEF4aW9zO1xuXG4gICAgY29uc3RydWN0b3IodG9rZW46IHN0cmluZykge1xuICAgICAgICB0aGlzLnRva2VuID0gdG9rZW47XG4gICAgICAgIHRoaXMuYXBpSW5zdGFuY2UgPSBheGlvcy5jcmVhdGUoe2Jhc2VVUkw6ICdodHRwczovL2FwaS5rcGFlaHMuY29tL3YxJ30pXG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0QWxsUHJvamVjdCgpOlByb21pc2U8S1BBUHJvamVjdE1vZGVsW10+IHtcbiAgICAgICAgbGV0IHJlc3VsdCA6IEtQQVByb2plY3RNb2RlbFtdID0gW107XG4gICAgICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy5hcGlJbnN0YW5jZS5wb3N0KCdwcm9qZWN0cy5saXN0Jywge3Rva2VuOnRoaXMudG9rZW59KTtcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSlcbiAgICAgICAgZm9yICh2YXIgcHJvamVjdERhdGEgb2YgZGF0YSkge1xuICAgICAgICAgICAgbGV0IHByb2plY3QgPSBPYmplY3QuYXNzaWduKG5ldyBLUEFQcm9qZWN0TW9kZWwoKSwgcHJvamVjdERhdGEpO1xuICAgICAgICAgICAgcmVzdWx0LnB1c2gocHJvamVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBhc3luYyBzYXZlUHJvamVjdChzaXRlOiBzdHJpbmcsIG1vZGVsczogS1BBUHJvamVjdE1vZGVsW10pIDogUHJvbWlzZTxib29sZWFuPiB7XG5cbiAgICAgICAgdmFyIGNsZWFuUmVjb3JkcyA6IEtQQVByb2plY3RNb2RlbFtdID0gW11cbiAgICAgICAgdmFyIGludmFsaWRSZWNvcmRzIDogS1BBUHJvamVjdE1vZGVsW10gPSBbXVxuXG4gICAgICAgIGZvciAodmFyIG1vZGVsIG9mIG1vZGVscykge1xuXG4gICAgICAgICAgICAvL0lnbm9yZSBQcm9qZWN0IHdpdGhvdXQgam9iIG51bWJlclxuICAgICAgICAgICAgaWYgKG1vZGVsLmNvZGUgPT09IG51bGwgfHwgbW9kZWwuY29kZSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICBpbnZhbGlkUmVjb3Jkcy5wdXNoKG1vZGVsKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpc0R1cGxpY2F0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjbGVhblJlY29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY2xlYXJSZWNvcmQgOiBLUEFQcm9qZWN0TW9kZWwgPSBjbGVhblJlY29yZHNbaV07XG4gICAgICAgICAgICAgICAgaWYgKGNsZWFyUmVjb3JkLmNvZGUgPT09IG1vZGVsLmNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNEdXBsaWNhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpbnZhbGlkUmVjb3Jkcy5wdXNoKG1vZGVsKVxuICAgICAgICAgICAgICAgICAgICBpbnZhbGlkUmVjb3Jkcy5wdXNoKGNsZWFyUmVjb3JkKVxuICAgICAgICAgICAgICAgICAgICBjbGVhblJlY29yZHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghaXNEdXBsaWNhdGUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpbnZhbGlkUmVjb3JkIG9mIGludmFsaWRSZWNvcmRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnZhbGlkUmVjb3JkLmNvZGUgPT09IG1vZGVsLmNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRHVwbGljYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGludmFsaWRSZWNvcmRzLnB1c2gobW9kZWwpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFpc0R1cGxpY2F0ZSkge1xuICAgICAgICAgICAgICAgIGNsZWFuUmVjb3Jkcy5wdXNoKG1vZGVsKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNsZWFuUmVjb3Jkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLiNzZW5kRGF0YVRvS1BBKHNpdGUsIGNsZWFuUmVjb3JkcylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbnZhbGlkUmVjb3Jkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLiNzZW5kRGF0YVRvS1BBKHNpdGUsIGludmFsaWRSZWNvcmRzKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7ICAgICAgICBcbiAgICB9XG5cbiAgICBhc3luYyAjc2VuZERhdGFUb0tQQShzaXRlOiBzdHJpbmcsIG1vZGVsczogS1BBUHJvamVjdE1vZGVsW10pIDogUHJvbWlzZTxib29sZWFuPiB7XG5cbiAgICAgICAgbGV0IGhlYWRlcnMgPSAnU2l0ZSxSZWNvcmRUeXBlLE5hbWUsTnVtYmVyLElzQWN0aXZlLEFkZHJlc3MsQ2l0eSxTdGF0ZSxaSVAnO1xuICAgICAgICB2YXIgY29udGVudCA9IGAke2hlYWRlcnN9YDtcbiAgICAgICAgZm9yKHZhciBtb2RlbCBvZiBtb2RlbHMpIHtcblxuICAgICAgICAgICAgY29udGVudCA9IGAke2NvbnRlbnR9XFxuJHtzaXRlfSxQcm9qZWN0YFxuICAgICAgICAgICAgY29udGVudCA9IGAke2NvbnRlbnR9LCR7SGVscGVyLmNzdkNvbnRlbnRDaGVja2VyKG1vZGVsLm5hbWUpfWBcbiAgICAgICAgICAgIGNvbnRlbnQgPSBgJHtjb250ZW50fSwke0hlbHBlci5jc3ZDb250ZW50Q2hlY2tlcihtb2RlbC5jb2RlKX1gXG4gICAgICAgICAgICBjb250ZW50ID0gYCR7Y29udGVudH0sJHttb2RlbC5pc0FjdGl2ZSA/ICdZJzonTid9YFxuICAgICAgICAgICAgY29udGVudCA9IGAke2NvbnRlbnR9LCR7SGVscGVyLmNzdkNvbnRlbnRDaGVja2VyKG1vZGVsLmFkZHJlc3MpfWBcbiAgICAgICAgICAgIGNvbnRlbnQgPSBgJHtjb250ZW50fSwke0hlbHBlci5jc3ZDb250ZW50Q2hlY2tlcihtb2RlbC5jaXR5KX1gXG4gICAgICAgICAgICBjb250ZW50ID0gYCR7Y29udGVudH0sJHtIZWxwZXIuY3N2Q29udGVudENoZWNrZXIobW9kZWwuc3RhdGUpfWBcbiAgICAgICAgICAgIGNvbnRlbnQgPSBgJHtjb250ZW50fSwke0hlbHBlci5jc3ZDb250ZW50Q2hlY2tlcihtb2RlbC56aXApfWBcbiAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmlsZURhdGEgPSBCdWZmZXIuZnJvbShjb250ZW50LCAnYmluYXJ5JykudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuXG4gICAgICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy5hcGlJbnN0YW5jZS5wb3N0KCdkYXRhbG9hZC5jcmVhdGUnLCB7XG4gICAgICAgICAgICB0b2tlbjp0aGlzLnRva2VuLFxuICAgICAgICAgICAgZmlsZTogYGRhdGE6dGV4dC9jc3Y7YmFzZTY0LCR7ZmlsZURhdGF9YCxcbiAgICAgICAgICAgIGZhaWx1cmVFbWFpbHM6IFtdLFxuICAgICAgICAgICAgc3VjY2Vzc0VtYWlsczogW11cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc29sZS5sb2coZGF0YSlcblxuICAgICAgICByZXR1cm4gZGF0YS5vaztcbiAgICB9XG5cbn0iXX0=