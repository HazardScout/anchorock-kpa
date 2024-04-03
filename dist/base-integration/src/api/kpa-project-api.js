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
        name: 'projects.csv',
        failureEmails: [],
        successEmails: []
    });
    (0, util_1.debuglog)('log:worker:dataload-response')('employees', data);
    if (!data.ok) {
        throw new Error(`${data.error}:${data.description}`);
    }
    return data.ok;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3BhLXByb2plY3QtYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvYXBpL2twYS1wcm9qZWN0LWFwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxpQ0FBcUM7QUFDckMsb0NBQTJDO0FBQzNDLDRDQUFzQztBQUN0QywrQkFBZ0M7QUFFaEMsTUFBYSxhQUFhO0lBSXRCLFlBQVksS0FBYTs7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxlQUFLLENBQUMsTUFBTSxDQUFDLEVBQUMsT0FBTyxFQUFFLDJCQUEyQixFQUFDLENBQUMsQ0FBQTtJQUMzRSxDQUFDO0lBRUQsS0FBSyxDQUFDLGFBQWE7UUFDZixJQUFJLE1BQU0sR0FBdUIsRUFBRSxDQUFDO1FBQ3BDLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFDLEtBQUssRUFBQyxJQUFJLENBQUMsS0FBSyxFQUFDLENBQUMsQ0FBQztRQUNsRixJQUFBLGVBQVEsRUFBQyxtQkFBbUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ25DLEtBQUssSUFBSSxXQUFXLElBQUksSUFBSSxFQUFFLENBQUM7WUFDM0IsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLHVCQUFlLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUNoRSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pCLENBQUM7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRUQsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFZLEVBQUUsTUFBeUI7UUFFckQsSUFBSSxZQUFZLEdBQXVCLEVBQUUsQ0FBQTtRQUN6QyxJQUFJLGNBQWMsR0FBdUIsRUFBRSxDQUFBO1FBRTNDLEtBQUssSUFBSSxLQUFLLElBQUksTUFBTSxFQUFFLENBQUM7WUFFdkIsbUNBQW1DO1lBQ25DLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxFQUFFLEVBQUUsQ0FBQztnQkFDM0MsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQkFDMUIsU0FBUTtZQUNaLENBQUM7WUFFRCxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUM7WUFDeEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDM0MsSUFBSSxXQUFXLEdBQXFCLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEQsSUFBSSxXQUFXLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDbEMsV0FBVyxHQUFHLElBQUksQ0FBQztvQkFDbkIsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtvQkFDMUIsY0FBYyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtvQkFDaEMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQzFCLE1BQU07Z0JBQ1YsQ0FBQztZQUNMLENBQUM7WUFFRCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ2YsS0FBSyxJQUFJLGFBQWEsSUFBSSxjQUFjLEVBQUUsQ0FBQztvQkFDdkMsSUFBSSxhQUFhLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQzt3QkFDcEMsV0FBVyxHQUFHLElBQUksQ0FBQzt3QkFDbkIsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTt3QkFDMUIsTUFBTTtvQkFDVixDQUFDO2dCQUNMLENBQUM7WUFDTCxDQUFDO1lBRUQsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUNmLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDNUIsQ0FBQztRQUNMLENBQUM7UUFFRCxJQUFJLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDMUIsTUFBTSx1QkFBQSxJQUFJLDhEQUFlLE1BQW5CLElBQUksRUFBZ0IsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFBO1FBQ2pELENBQUM7UUFFRCxJQUFJLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDNUIsTUFBTSx1QkFBQSxJQUFJLDhEQUFlLE1BQW5CLElBQUksRUFBZ0IsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFBO1FBQ25ELENBQUM7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0NBcUNKO0FBMUdELHNDQTBHQzt5RUFuQ0csS0FBSyx1Q0FBZ0IsSUFBWSxFQUFFLE1BQXlCO0lBRXhELElBQUksT0FBTyxHQUFHLDZEQUE2RCxDQUFDO0lBQzVFLElBQUksT0FBTyxHQUFHLEdBQUcsT0FBTyxFQUFFLENBQUM7SUFDM0IsS0FBSSxJQUFJLEtBQUssSUFBSSxNQUFNLEVBQUUsQ0FBQztRQUV0QixPQUFPLEdBQUcsR0FBRyxPQUFPLEtBQUssSUFBSSxVQUFVLENBQUE7UUFDdkMsT0FBTyxHQUFHLEdBQUcsT0FBTyxJQUFJLGtCQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUE7UUFDOUQsT0FBTyxHQUFHLEdBQUcsT0FBTyxJQUFJLGtCQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUE7UUFDOUQsT0FBTyxHQUFHLEdBQUcsT0FBTyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQSxDQUFDLENBQUEsR0FBRyxFQUFFLENBQUE7UUFDbEQsT0FBTyxHQUFHLEdBQUcsT0FBTyxJQUFJLGtCQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUE7UUFDakUsT0FBTyxHQUFHLEdBQUcsT0FBTyxJQUFJLGtCQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUE7UUFDOUQsT0FBTyxHQUFHLEdBQUcsT0FBTyxJQUFJLGtCQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUE7UUFDL0QsT0FBTyxHQUFHLEdBQUcsT0FBTyxJQUFJLGtCQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUE7SUFFakUsQ0FBQztJQUVELE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUVuRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtRQUM1RCxLQUFLLEVBQUMsSUFBSSxDQUFDLEtBQUs7UUFDaEIsSUFBSSxFQUFFLHdCQUF3QixRQUFRLEVBQUU7UUFDeEMsSUFBSSxFQUFFLGNBQWM7UUFDcEIsYUFBYSxFQUFFLEVBQUU7UUFDakIsYUFBYSxFQUFFLEVBQUU7S0FDcEIsQ0FBQyxDQUFDO0lBRUgsSUFBQSxlQUFRLEVBQUMsOEJBQThCLENBQUMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDM0QsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUNYLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7QUFDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBheGlvcywgeyBBeGlvcyB9IGZyb20gXCJheGlvc1wiO1xuaW1wb3J0IHsgS1BBUHJvamVjdE1vZGVsIH0gZnJvbSBcIi4uL21vZGVsXCI7XG5pbXBvcnQgeyBIZWxwZXIgfSBmcm9tIFwiLi4vdXRpbGl0aWVzXCI7XG5pbXBvcnQgeyBkZWJ1Z2xvZyB9IGZyb20gJ3V0aWwnO1xuXG5leHBvcnQgY2xhc3MgS1BBUHJvamVjdEFQSSB7XG4gICAgdG9rZW46IHN0cmluZztcbiAgICBhcGlJbnN0YW5jZTogQXhpb3M7XG5cbiAgICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMudG9rZW4gPSB0b2tlbjtcbiAgICAgICAgdGhpcy5hcGlJbnN0YW5jZSA9IGF4aW9zLmNyZWF0ZSh7YmFzZVVSTDogJ2h0dHBzOi8vYXBpLmtwYWVocy5jb20vdjEnfSlcbiAgICB9XG5cbiAgICBhc3luYyBnZXRBbGxQcm9qZWN0KCk6UHJvbWlzZTxLUEFQcm9qZWN0TW9kZWxbXT4ge1xuICAgICAgICBsZXQgcmVzdWx0IDogS1BBUHJvamVjdE1vZGVsW10gPSBbXTtcbiAgICAgICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLmFwaUluc3RhbmNlLnBvc3QoJ3Byb2plY3RzLmxpc3QnLCB7dG9rZW46dGhpcy50b2tlbn0pO1xuICAgICAgICBkZWJ1Z2xvZygnbG9nOmJhc2U6cHJvamVjdHMnKShkYXRhKVxuICAgICAgICBmb3IgKHZhciBwcm9qZWN0RGF0YSBvZiBkYXRhKSB7XG4gICAgICAgICAgICBsZXQgcHJvamVjdCA9IE9iamVjdC5hc3NpZ24obmV3IEtQQVByb2plY3RNb2RlbCgpLCBwcm9qZWN0RGF0YSk7XG4gICAgICAgICAgICByZXN1bHQucHVzaChwcm9qZWN0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGFzeW5jIHNhdmVQcm9qZWN0KHNpdGU6IHN0cmluZywgbW9kZWxzOiBLUEFQcm9qZWN0TW9kZWxbXSkgOiBQcm9taXNlPGJvb2xlYW4+IHtcblxuICAgICAgICB2YXIgY2xlYW5SZWNvcmRzIDogS1BBUHJvamVjdE1vZGVsW10gPSBbXVxuICAgICAgICB2YXIgaW52YWxpZFJlY29yZHMgOiBLUEFQcm9qZWN0TW9kZWxbXSA9IFtdXG5cbiAgICAgICAgZm9yICh2YXIgbW9kZWwgb2YgbW9kZWxzKSB7XG5cbiAgICAgICAgICAgIC8vSWdub3JlIFByb2plY3Qgd2l0aG91dCBqb2IgbnVtYmVyXG4gICAgICAgICAgICBpZiAobW9kZWwuY29kZSA9PT0gbnVsbCB8fCBtb2RlbC5jb2RlID09PSAnJykge1xuICAgICAgICAgICAgICAgIGludmFsaWRSZWNvcmRzLnB1c2gobW9kZWwpXG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGlzRHVwbGljYXRlID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNsZWFuUmVjb3Jkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBjbGVhclJlY29yZCA6IEtQQVByb2plY3RNb2RlbCA9IGNsZWFuUmVjb3Jkc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoY2xlYXJSZWNvcmQuY29kZSA9PT0gbW9kZWwuY29kZSkge1xuICAgICAgICAgICAgICAgICAgICBpc0R1cGxpY2F0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGludmFsaWRSZWNvcmRzLnB1c2gobW9kZWwpXG4gICAgICAgICAgICAgICAgICAgIGludmFsaWRSZWNvcmRzLnB1c2goY2xlYXJSZWNvcmQpXG4gICAgICAgICAgICAgICAgICAgIGNsZWFuUmVjb3Jkcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFpc0R1cGxpY2F0ZSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGludmFsaWRSZWNvcmQgb2YgaW52YWxpZFJlY29yZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGludmFsaWRSZWNvcmQuY29kZSA9PT0gbW9kZWwuY29kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNEdXBsaWNhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW52YWxpZFJlY29yZHMucHVzaChtb2RlbClcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWlzRHVwbGljYXRlKSB7XG4gICAgICAgICAgICAgICAgY2xlYW5SZWNvcmRzLnB1c2gobW9kZWwpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2xlYW5SZWNvcmRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuI3NlbmREYXRhVG9LUEEoc2l0ZSwgY2xlYW5SZWNvcmRzKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGludmFsaWRSZWNvcmRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuI3NlbmREYXRhVG9LUEEoc2l0ZSwgaW52YWxpZFJlY29yZHMpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBhc3luYyAjc2VuZERhdGFUb0tQQShzaXRlOiBzdHJpbmcsIG1vZGVsczogS1BBUHJvamVjdE1vZGVsW10pIDogUHJvbWlzZTxib29sZWFuPiB7XG5cbiAgICAgICAgbGV0IGhlYWRlcnMgPSAnU2l0ZSxSZWNvcmRUeXBlLE5hbWUsTnVtYmVyLElzQWN0aXZlLEFkZHJlc3MsQ2l0eSxTdGF0ZSxaSVAnO1xuICAgICAgICB2YXIgY29udGVudCA9IGAke2hlYWRlcnN9YDtcbiAgICAgICAgZm9yKHZhciBtb2RlbCBvZiBtb2RlbHMpIHtcblxuICAgICAgICAgICAgY29udGVudCA9IGAke2NvbnRlbnR9XFxuJHtzaXRlfSxQcm9qZWN0YFxuICAgICAgICAgICAgY29udGVudCA9IGAke2NvbnRlbnR9LCR7SGVscGVyLmNzdkNvbnRlbnRDaGVja2VyKG1vZGVsLm5hbWUpfWBcbiAgICAgICAgICAgIGNvbnRlbnQgPSBgJHtjb250ZW50fSwke0hlbHBlci5jc3ZDb250ZW50Q2hlY2tlcihtb2RlbC5jb2RlKX1gXG4gICAgICAgICAgICBjb250ZW50ID0gYCR7Y29udGVudH0sJHttb2RlbC5pc0FjdGl2ZSA/ICdZJzonTid9YFxuICAgICAgICAgICAgY29udGVudCA9IGAke2NvbnRlbnR9LCR7SGVscGVyLmNzdkNvbnRlbnRDaGVja2VyKG1vZGVsLmFkZHJlc3MpfWBcbiAgICAgICAgICAgIGNvbnRlbnQgPSBgJHtjb250ZW50fSwke0hlbHBlci5jc3ZDb250ZW50Q2hlY2tlcihtb2RlbC5jaXR5KX1gXG4gICAgICAgICAgICBjb250ZW50ID0gYCR7Y29udGVudH0sJHtIZWxwZXIuY3N2Q29udGVudENoZWNrZXIobW9kZWwuc3RhdGUpfWBcbiAgICAgICAgICAgIGNvbnRlbnQgPSBgJHtjb250ZW50fSwke0hlbHBlci5jc3ZDb250ZW50Q2hlY2tlcihtb2RlbC56aXApfWBcblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmlsZURhdGEgPSBCdWZmZXIuZnJvbShjb250ZW50LCAnYmluYXJ5JykudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuXG4gICAgICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy5hcGlJbnN0YW5jZS5wb3N0KCdkYXRhbG9hZC5jcmVhdGUnLCB7XG4gICAgICAgICAgICB0b2tlbjp0aGlzLnRva2VuLFxuICAgICAgICAgICAgZmlsZTogYGRhdGE6dGV4dC9jc3Y7YmFzZTY0LCR7ZmlsZURhdGF9YCxcbiAgICAgICAgICAgIG5hbWU6ICdwcm9qZWN0cy5jc3YnLFxuICAgICAgICAgICAgZmFpbHVyZUVtYWlsczogW10sXG4gICAgICAgICAgICBzdWNjZXNzRW1haWxzOiBbXVxuICAgICAgICB9KTtcblxuICAgICAgICBkZWJ1Z2xvZygnbG9nOndvcmtlcjpkYXRhbG9hZC1yZXNwb25zZScpKCdlbXBsb3llZXMnLCBkYXRhKVxuICAgICAgICBpZiAoIWRhdGEub2spIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtkYXRhLmVycm9yfToke2RhdGEuZGVzY3JpcHRpb259YCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGF0YS5vaztcbiAgICB9XG5cbn0iXX0=