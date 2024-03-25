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
        name: 'procore: projects.csv',
        failureEmails: [],
        successEmails: []
    });
    (0, util_1.debuglog)('log:worker:dataload-response')('procore.employees', data);
    if (!data.ok) {
        throw new Error(`${data.error}:${data.description}`);
    }
    return data.ok;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3BhLXByb2plY3QtYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvYXBpL2twYS1wcm9qZWN0LWFwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxpQ0FBcUM7QUFDckMsb0NBQTJDO0FBQzNDLDRDQUFzQztBQUN0QywrQkFBZ0M7QUFFaEMsTUFBYSxhQUFhO0lBSXRCLFlBQVksS0FBYTs7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxlQUFLLENBQUMsTUFBTSxDQUFDLEVBQUMsT0FBTyxFQUFFLDJCQUEyQixFQUFDLENBQUMsQ0FBQTtJQUMzRSxDQUFDO0lBRUQsS0FBSyxDQUFDLGFBQWE7UUFDZixJQUFJLE1BQU0sR0FBdUIsRUFBRSxDQUFDO1FBQ3BDLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFDLEtBQUssRUFBQyxJQUFJLENBQUMsS0FBSyxFQUFDLENBQUMsQ0FBQztRQUNsRixJQUFBLGVBQVEsRUFBQyxtQkFBbUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ25DLEtBQUssSUFBSSxXQUFXLElBQUksSUFBSSxFQUFFLENBQUM7WUFDM0IsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLHVCQUFlLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUNoRSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pCLENBQUM7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRUQsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFZLEVBQUUsTUFBeUI7UUFFckQsSUFBSSxZQUFZLEdBQXVCLEVBQUUsQ0FBQTtRQUN6QyxJQUFJLGNBQWMsR0FBdUIsRUFBRSxDQUFBO1FBRTNDLEtBQUssSUFBSSxLQUFLLElBQUksTUFBTSxFQUFFLENBQUM7WUFFdkIsbUNBQW1DO1lBQ25DLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxFQUFFLEVBQUUsQ0FBQztnQkFDM0MsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQkFDMUIsU0FBUTtZQUNaLENBQUM7WUFFRCxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUM7WUFDeEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDM0MsSUFBSSxXQUFXLEdBQXFCLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEQsSUFBSSxXQUFXLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDbEMsV0FBVyxHQUFHLElBQUksQ0FBQztvQkFDbkIsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtvQkFDMUIsY0FBYyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtvQkFDaEMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQzFCLE1BQU07Z0JBQ1YsQ0FBQztZQUNMLENBQUM7WUFFRCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ2YsS0FBSyxJQUFJLGFBQWEsSUFBSSxjQUFjLEVBQUUsQ0FBQztvQkFDdkMsSUFBSSxhQUFhLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQzt3QkFDcEMsV0FBVyxHQUFHLElBQUksQ0FBQzt3QkFDbkIsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTt3QkFDMUIsTUFBTTtvQkFDVixDQUFDO2dCQUNMLENBQUM7WUFDTCxDQUFDO1lBRUQsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUNmLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDNUIsQ0FBQztRQUNMLENBQUM7UUFFRCxJQUFJLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDMUIsTUFBTSx1QkFBQSxJQUFJLDhEQUFlLE1BQW5CLElBQUksRUFBZ0IsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFBO1FBQ2pELENBQUM7UUFFRCxJQUFJLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDNUIsTUFBTSx1QkFBQSxJQUFJLDhEQUFlLE1BQW5CLElBQUksRUFBZ0IsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFBO1FBQ25ELENBQUM7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0NBcUNKO0FBMUdELHNDQTBHQzt5RUFuQ0csS0FBSyx1Q0FBZ0IsSUFBWSxFQUFFLE1BQXlCO0lBRXhELElBQUksT0FBTyxHQUFHLDZEQUE2RCxDQUFDO0lBQzVFLElBQUksT0FBTyxHQUFHLEdBQUcsT0FBTyxFQUFFLENBQUM7SUFDM0IsS0FBSSxJQUFJLEtBQUssSUFBSSxNQUFNLEVBQUUsQ0FBQztRQUV0QixPQUFPLEdBQUcsR0FBRyxPQUFPLEtBQUssSUFBSSxVQUFVLENBQUE7UUFDdkMsT0FBTyxHQUFHLEdBQUcsT0FBTyxJQUFJLGtCQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUE7UUFDOUQsT0FBTyxHQUFHLEdBQUcsT0FBTyxJQUFJLGtCQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUE7UUFDOUQsT0FBTyxHQUFHLEdBQUcsT0FBTyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQSxDQUFDLENBQUEsR0FBRyxFQUFFLENBQUE7UUFDbEQsT0FBTyxHQUFHLEdBQUcsT0FBTyxJQUFJLGtCQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUE7UUFDakUsT0FBTyxHQUFHLEdBQUcsT0FBTyxJQUFJLGtCQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUE7UUFDOUQsT0FBTyxHQUFHLEdBQUcsT0FBTyxJQUFJLGtCQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUE7UUFDL0QsT0FBTyxHQUFHLEdBQUcsT0FBTyxJQUFJLGtCQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUE7SUFFakUsQ0FBQztJQUVELE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUVuRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtRQUM1RCxLQUFLLEVBQUMsSUFBSSxDQUFDLEtBQUs7UUFDaEIsSUFBSSxFQUFFLHdCQUF3QixRQUFRLEVBQUU7UUFDeEMsSUFBSSxFQUFFLHVCQUF1QjtRQUM3QixhQUFhLEVBQUUsRUFBRTtRQUNqQixhQUFhLEVBQUUsRUFBRTtLQUNwQixDQUFDLENBQUM7SUFFSCxJQUFBLGVBQVEsRUFBQyw4QkFBOEIsQ0FBQyxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFBO0lBQ25FLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDWCxNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDO0FBQ25CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MsIHsgQXhpb3MgfSBmcm9tIFwiYXhpb3NcIjtcbmltcG9ydCB7IEtQQVByb2plY3RNb2RlbCB9IGZyb20gXCIuLi9tb2RlbFwiO1xuaW1wb3J0IHsgSGVscGVyIH0gZnJvbSBcIi4uL3V0aWxpdGllc1wiO1xuaW1wb3J0IHsgZGVidWdsb2cgfSBmcm9tICd1dGlsJztcblxuZXhwb3J0IGNsYXNzIEtQQVByb2plY3RBUEkge1xuICAgIHRva2VuOiBzdHJpbmc7XG4gICAgYXBpSW5zdGFuY2U6IEF4aW9zO1xuXG4gICAgY29uc3RydWN0b3IodG9rZW46IHN0cmluZykge1xuICAgICAgICB0aGlzLnRva2VuID0gdG9rZW47XG4gICAgICAgIHRoaXMuYXBpSW5zdGFuY2UgPSBheGlvcy5jcmVhdGUoe2Jhc2VVUkw6ICdodHRwczovL2FwaS5rcGFlaHMuY29tL3YxJ30pXG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0QWxsUHJvamVjdCgpOlByb21pc2U8S1BBUHJvamVjdE1vZGVsW10+IHtcbiAgICAgICAgbGV0IHJlc3VsdCA6IEtQQVByb2plY3RNb2RlbFtdID0gW107XG4gICAgICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy5hcGlJbnN0YW5jZS5wb3N0KCdwcm9qZWN0cy5saXN0Jywge3Rva2VuOnRoaXMudG9rZW59KTtcbiAgICAgICAgZGVidWdsb2coJ2xvZzpiYXNlOnByb2plY3RzJykoZGF0YSlcbiAgICAgICAgZm9yICh2YXIgcHJvamVjdERhdGEgb2YgZGF0YSkge1xuICAgICAgICAgICAgbGV0IHByb2plY3QgPSBPYmplY3QuYXNzaWduKG5ldyBLUEFQcm9qZWN0TW9kZWwoKSwgcHJvamVjdERhdGEpO1xuICAgICAgICAgICAgcmVzdWx0LnB1c2gocHJvamVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBhc3luYyBzYXZlUHJvamVjdChzaXRlOiBzdHJpbmcsIG1vZGVsczogS1BBUHJvamVjdE1vZGVsW10pIDogUHJvbWlzZTxib29sZWFuPiB7XG5cbiAgICAgICAgdmFyIGNsZWFuUmVjb3JkcyA6IEtQQVByb2plY3RNb2RlbFtdID0gW11cbiAgICAgICAgdmFyIGludmFsaWRSZWNvcmRzIDogS1BBUHJvamVjdE1vZGVsW10gPSBbXVxuXG4gICAgICAgIGZvciAodmFyIG1vZGVsIG9mIG1vZGVscykge1xuXG4gICAgICAgICAgICAvL0lnbm9yZSBQcm9qZWN0IHdpdGhvdXQgam9iIG51bWJlclxuICAgICAgICAgICAgaWYgKG1vZGVsLmNvZGUgPT09IG51bGwgfHwgbW9kZWwuY29kZSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICBpbnZhbGlkUmVjb3Jkcy5wdXNoKG1vZGVsKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpc0R1cGxpY2F0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjbGVhblJlY29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY2xlYXJSZWNvcmQgOiBLUEFQcm9qZWN0TW9kZWwgPSBjbGVhblJlY29yZHNbaV07XG4gICAgICAgICAgICAgICAgaWYgKGNsZWFyUmVjb3JkLmNvZGUgPT09IG1vZGVsLmNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNEdXBsaWNhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpbnZhbGlkUmVjb3Jkcy5wdXNoKG1vZGVsKVxuICAgICAgICAgICAgICAgICAgICBpbnZhbGlkUmVjb3Jkcy5wdXNoKGNsZWFyUmVjb3JkKVxuICAgICAgICAgICAgICAgICAgICBjbGVhblJlY29yZHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghaXNEdXBsaWNhdGUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpbnZhbGlkUmVjb3JkIG9mIGludmFsaWRSZWNvcmRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnZhbGlkUmVjb3JkLmNvZGUgPT09IG1vZGVsLmNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRHVwbGljYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGludmFsaWRSZWNvcmRzLnB1c2gobW9kZWwpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFpc0R1cGxpY2F0ZSkge1xuICAgICAgICAgICAgICAgIGNsZWFuUmVjb3Jkcy5wdXNoKG1vZGVsKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNsZWFuUmVjb3Jkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLiNzZW5kRGF0YVRvS1BBKHNpdGUsIGNsZWFuUmVjb3JkcylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbnZhbGlkUmVjb3Jkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLiNzZW5kRGF0YVRvS1BBKHNpdGUsIGludmFsaWRSZWNvcmRzKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgYXN5bmMgI3NlbmREYXRhVG9LUEEoc2l0ZTogc3RyaW5nLCBtb2RlbHM6IEtQQVByb2plY3RNb2RlbFtdKSA6IFByb21pc2U8Ym9vbGVhbj4ge1xuXG4gICAgICAgIGxldCBoZWFkZXJzID0gJ1NpdGUsUmVjb3JkVHlwZSxOYW1lLE51bWJlcixJc0FjdGl2ZSxBZGRyZXNzLENpdHksU3RhdGUsWklQJztcbiAgICAgICAgdmFyIGNvbnRlbnQgPSBgJHtoZWFkZXJzfWA7XG4gICAgICAgIGZvcih2YXIgbW9kZWwgb2YgbW9kZWxzKSB7XG5cbiAgICAgICAgICAgIGNvbnRlbnQgPSBgJHtjb250ZW50fVxcbiR7c2l0ZX0sUHJvamVjdGBcbiAgICAgICAgICAgIGNvbnRlbnQgPSBgJHtjb250ZW50fSwke0hlbHBlci5jc3ZDb250ZW50Q2hlY2tlcihtb2RlbC5uYW1lKX1gXG4gICAgICAgICAgICBjb250ZW50ID0gYCR7Y29udGVudH0sJHtIZWxwZXIuY3N2Q29udGVudENoZWNrZXIobW9kZWwuY29kZSl9YFxuICAgICAgICAgICAgY29udGVudCA9IGAke2NvbnRlbnR9LCR7bW9kZWwuaXNBY3RpdmUgPyAnWSc6J04nfWBcbiAgICAgICAgICAgIGNvbnRlbnQgPSBgJHtjb250ZW50fSwke0hlbHBlci5jc3ZDb250ZW50Q2hlY2tlcihtb2RlbC5hZGRyZXNzKX1gXG4gICAgICAgICAgICBjb250ZW50ID0gYCR7Y29udGVudH0sJHtIZWxwZXIuY3N2Q29udGVudENoZWNrZXIobW9kZWwuY2l0eSl9YFxuICAgICAgICAgICAgY29udGVudCA9IGAke2NvbnRlbnR9LCR7SGVscGVyLmNzdkNvbnRlbnRDaGVja2VyKG1vZGVsLnN0YXRlKX1gXG4gICAgICAgICAgICBjb250ZW50ID0gYCR7Y29udGVudH0sJHtIZWxwZXIuY3N2Q29udGVudENoZWNrZXIobW9kZWwuemlwKX1gXG5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZpbGVEYXRhID0gQnVmZmVyLmZyb20oY29udGVudCwgJ2JpbmFyeScpLnRvU3RyaW5nKCdiYXNlNjQnKTtcblxuICAgICAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuYXBpSW5zdGFuY2UucG9zdCgnZGF0YWxvYWQuY3JlYXRlJywge1xuICAgICAgICAgICAgdG9rZW46dGhpcy50b2tlbixcbiAgICAgICAgICAgIGZpbGU6IGBkYXRhOnRleHQvY3N2O2Jhc2U2NCwke2ZpbGVEYXRhfWAsXG4gICAgICAgICAgICBuYW1lOiAncHJvY29yZTogcHJvamVjdHMuY3N2JyxcbiAgICAgICAgICAgIGZhaWx1cmVFbWFpbHM6IFtdLFxuICAgICAgICAgICAgc3VjY2Vzc0VtYWlsczogW11cbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGVidWdsb2coJ2xvZzp3b3JrZXI6ZGF0YWxvYWQtcmVzcG9uc2UnKSgncHJvY29yZS5lbXBsb3llZXMnLCBkYXRhKVxuICAgICAgICBpZiAoIWRhdGEub2spIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtkYXRhLmVycm9yfToke2RhdGEuZGVzY3JpcHRpb259YCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGF0YS5vaztcbiAgICB9XG5cbn0iXX0=