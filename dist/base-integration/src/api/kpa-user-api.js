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
    async saveUser(site, models) {
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
            await __classPrivateFieldGet(this, _KPAUserAPI_instances, "m", _KPAUserAPI_sendDataToKPA).call(this, site, cleanRecords);
        }
        if (invalidRecords.length > 0) {
            await __classPrivateFieldGet(this, _KPAUserAPI_instances, "m", _KPAUserAPI_sendDataToKPA).call(this, site, invalidRecords);
        }
        return true;
    }
}
exports.KPAUserAPI = KPAUserAPI;
_KPAUserAPI_instances = new WeakSet(), _KPAUserAPI_sendDataToKPA = async function _KPAUserAPI_sendDataToKPA(site, models) {
    var _a;
    let headers = 'Site,RecordType,EmployeeNumber,FirstName,LastName,Username,InitialPassword,Role,Title,Email,TerminationDate,ForcePasswordSelection,SendWelcomeEmail';
    var content = `${headers}`;
    for (var model of models) {
        var dataUser = `${site},Employee`;
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
        content = `${content}\n${dataUser}`;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3BhLXVzZXItYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvYXBpL2twYS11c2VyLWFwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxpQ0FBcUM7QUFDckMsb0NBQXdDO0FBQ3hDLDRDQUFzQztBQUd0QyxNQUFhLFVBQVU7SUFJbkIsWUFBWSxLQUFhOztRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsV0FBVyxHQUFHLGVBQUssQ0FBQyxNQUFNLENBQUMsRUFBQyxPQUFPLEVBQUUsMkJBQTJCLEVBQUMsQ0FBQyxDQUFBO0lBQzNFLENBQUM7SUFFRCxLQUFLLENBQUMsVUFBVTtRQUNaLElBQUksTUFBTSxHQUFvQixFQUFFLENBQUM7UUFDakMsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLEVBQUMsS0FBSyxFQUFDLElBQUksQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDO1FBQy9FLEtBQUssSUFBSSxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzlCLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxvQkFBWSxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDdkQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QixDQUFDO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVELEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBWSxFQUFFLE1BQXNCO1FBQy9DLElBQUksWUFBWSxHQUFvQixFQUFFLENBQUE7UUFDdEMsSUFBSSxjQUFjLEdBQW9CLEVBQUUsQ0FBQTtRQUV4QyxLQUFLLElBQUksS0FBSyxJQUFJLE1BQU0sRUFBRSxDQUFDO1lBRXZCLHFDQUFxQztZQUNyQyxJQUFJLEtBQUssQ0FBQyxjQUFjLEtBQUssSUFBSSxJQUFJLEtBQUssQ0FBQyxjQUFjLEtBQUssRUFBRSxFQUFFLENBQUM7Z0JBQy9ELGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7Z0JBQzFCLFNBQVM7WUFDYixDQUFDO1lBRUQsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQ3hCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQzNDLElBQUksV0FBVyxHQUFrQixZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pELElBQUksV0FBVyxDQUFDLFFBQVEsS0FBSyxLQUFLLENBQUMsUUFBUSxJQUFJLFdBQVcsQ0FBQyxjQUFjLEtBQUssS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUNqRyxXQUFXLEdBQUcsSUFBSSxDQUFDO29CQUNuQixjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO29CQUMxQixjQUFjLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO29CQUNoQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDMUIsTUFBTTtnQkFDVixDQUFDO1lBQ0wsQ0FBQztZQUVELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDZixLQUFLLElBQUksYUFBYSxJQUFJLGNBQWMsRUFBRSxDQUFDO29CQUN2QyxJQUFJLGFBQWEsQ0FBQyxRQUFRLEtBQUssS0FBSyxDQUFDLFFBQVEsSUFBSSxhQUFhLENBQUMsY0FBYyxLQUFLLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQzt3QkFDckcsV0FBVyxHQUFHLElBQUksQ0FBQzt3QkFDbkIsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTt3QkFDMUIsTUFBTTtvQkFDVixDQUFDO2dCQUNMLENBQUM7WUFDTCxDQUFDO1lBRUQsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUNmLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDNUIsQ0FBQztRQUNMLENBQUM7UUFFRCxJQUFJLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDMUIsTUFBTSx1QkFBQSxJQUFJLHdEQUFlLE1BQW5CLElBQUksRUFBZ0IsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFBO1FBQ2pELENBQUM7UUFFRCxJQUFJLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDNUIsTUFBTSx1QkFBQSxJQUFJLHdEQUFlLE1BQW5CLElBQUksRUFBZ0IsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFBO1FBQ25ELENBQUM7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0NBdUNKO0FBMUdELGdDQTBHQzttRUFyQ0csS0FBSyxvQ0FBZ0IsSUFBWSxFQUFFLE1BQXNCOztJQUVyRCxJQUFJLE9BQU8sR0FBRyxxSkFBcUosQ0FBQztJQUNwSyxJQUFJLE9BQU8sR0FBRyxHQUFHLE9BQU8sRUFBRSxDQUFDO0lBRTNCLEtBQUksSUFBSSxLQUFLLElBQUksTUFBTSxFQUFFLENBQUM7UUFFdEIsSUFBSSxRQUFRLEdBQUcsR0FBRyxJQUFJLFdBQVcsQ0FBQTtRQUNqQyxRQUFRLEdBQUcsR0FBRyxRQUFRLElBQUksa0JBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQTtRQUMxRSxRQUFRLEdBQUcsR0FBRyxRQUFRLElBQUksa0JBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQTtRQUNyRSxRQUFRLEdBQUcsR0FBRyxRQUFRLElBQUksa0JBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQTtRQUNwRSxRQUFRLEdBQUcsR0FBRyxRQUFRLElBQUksa0JBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQTtRQUNwRSxRQUFRLEdBQUcsR0FBRyxRQUFRLElBQUksa0JBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQTtRQUMzRSxRQUFRLEdBQUcsR0FBRyxRQUFRLElBQUksa0JBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQTtRQUNoRSxRQUFRLEdBQUcsR0FBRyxRQUFRLElBQUksa0JBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQTtRQUNqRSxRQUFRLEdBQUcsR0FBRyxRQUFRLElBQUksa0JBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQTtRQUNqRSxRQUFRLEdBQUcsR0FBRyxRQUFRLElBQUksa0JBQU0sQ0FBQyxpQkFBaUIsQ0FBQyxNQUFBLEtBQUssQ0FBQyxlQUFlLG1DQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUE7UUFDakYsUUFBUSxHQUFHLEdBQUcsUUFBUSxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUE7UUFDMUQsUUFBUSxHQUFHLEdBQUcsUUFBUSxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUE7UUFFekQsT0FBTyxHQUFHLEdBQUcsT0FBTyxLQUFLLFFBQVEsRUFBRSxDQUFBO0lBQ3ZDLENBQUM7SUFFRCxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFbkUsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUU7UUFDNUQsS0FBSyxFQUFDLElBQUksQ0FBQyxLQUFLO1FBQ2hCLElBQUksRUFBRSx3QkFBd0IsUUFBUSxFQUFFO1FBQ3hDLGFBQWEsRUFBRSxFQUFFO1FBQ2pCLGFBQWEsRUFBRSxFQUFFO0tBQ3BCLENBQUMsQ0FBQztJQUVILE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7SUFFakIsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDO0FBQ25CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MsIHsgQXhpb3MgfSBmcm9tIFwiYXhpb3NcIjtcbmltcG9ydCB7IEtQQVVzZXJNb2RlbCB9IGZyb20gXCIuLi9tb2RlbFwiO1xuaW1wb3J0IHsgSGVscGVyIH0gZnJvbSBcIi4uL3V0aWxpdGllc1wiO1xuaW1wb3J0IHsgY2xlYXIgfSBmcm9tIFwiY29uc29sZVwiO1xuXG5leHBvcnQgY2xhc3MgS1BBVXNlckFQSSB7XG4gICAgdG9rZW46IHN0cmluZztcbiAgICBhcGlJbnN0YW5jZTogQXhpb3M7XG5cbiAgICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMudG9rZW4gPSB0b2tlbjtcbiAgICAgICAgdGhpcy5hcGlJbnN0YW5jZSA9IGF4aW9zLmNyZWF0ZSh7YmFzZVVSTDogJ2h0dHBzOi8vYXBpLmtwYWVocy5jb20vdjEnfSlcbiAgICB9XG5cbiAgICBhc3luYyBnZXRBbGxVc2VyKCk6UHJvbWlzZTxLUEFVc2VyTW9kZWxbXT4ge1xuICAgICAgICBsZXQgcmVzdWx0IDogS1BBVXNlck1vZGVsW10gPSBbXTtcbiAgICAgICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLmFwaUluc3RhbmNlLnBvc3QoJ3VzZXJzLmxpc3QnLCB7dG9rZW46dGhpcy50b2tlbn0pO1xuICAgICAgICBmb3IgKHZhciB1c2VyRGF0YSBvZiBkYXRhLnVzZXJzKSB7XG4gICAgICAgICAgICBsZXQgdXNlciA9IE9iamVjdC5hc3NpZ24obmV3IEtQQVVzZXJNb2RlbCgpLCB1c2VyRGF0YSk7XG4gICAgICAgICAgICByZXN1bHQucHVzaCh1c2VyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGFzeW5jIHNhdmVVc2VyKHNpdGU6IHN0cmluZywgbW9kZWxzOiBLUEFVc2VyTW9kZWxbXSkgOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgdmFyIGNsZWFuUmVjb3JkcyA6IEtQQVVzZXJNb2RlbFtdID0gW11cbiAgICAgICAgdmFyIGludmFsaWRSZWNvcmRzIDogS1BBVXNlck1vZGVsW10gPSBbXVxuXG4gICAgICAgIGZvciAodmFyIG1vZGVsIG9mIG1vZGVscykge1xuXG4gICAgICAgICAgICAvL0lnbm9yZSB1c2VyIHdpdGhvdXQgZW1wbG95ZWUgbnVtYmVyXG4gICAgICAgICAgICBpZiAobW9kZWwuZW1wbG95ZWVOdW1iZXIgPT09IG51bGwgfHwgbW9kZWwuZW1wbG95ZWVOdW1iZXIgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgaW52YWxpZFJlY29yZHMucHVzaChtb2RlbClcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGlzRHVwbGljYXRlID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNsZWFuUmVjb3Jkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBjbGVhclJlY29yZCA6IEtQQVVzZXJNb2RlbCA9IGNsZWFuUmVjb3Jkc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoY2xlYXJSZWNvcmQudXNlcm5hbWUgPT09IG1vZGVsLnVzZXJuYW1lIHx8IGNsZWFyUmVjb3JkLmVtcGxveWVlTnVtYmVyID09PSBtb2RlbC5lbXBsb3llZU51bWJlcikge1xuICAgICAgICAgICAgICAgICAgICBpc0R1cGxpY2F0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGludmFsaWRSZWNvcmRzLnB1c2gobW9kZWwpXG4gICAgICAgICAgICAgICAgICAgIGludmFsaWRSZWNvcmRzLnB1c2goY2xlYXJSZWNvcmQpXG4gICAgICAgICAgICAgICAgICAgIGNsZWFuUmVjb3Jkcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFpc0R1cGxpY2F0ZSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGludmFsaWRSZWNvcmQgb2YgaW52YWxpZFJlY29yZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGludmFsaWRSZWNvcmQudXNlcm5hbWUgPT09IG1vZGVsLnVzZXJuYW1lIHx8IGludmFsaWRSZWNvcmQuZW1wbG95ZWVOdW1iZXIgPT09IG1vZGVsLmVtcGxveWVlTnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0R1cGxpY2F0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZhbGlkUmVjb3Jkcy5wdXNoKG1vZGVsKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghaXNEdXBsaWNhdGUpIHtcbiAgICAgICAgICAgICAgICBjbGVhblJlY29yZHMucHVzaChtb2RlbClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjbGVhblJlY29yZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy4jc2VuZERhdGFUb0tQQShzaXRlLCBjbGVhblJlY29yZHMpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW52YWxpZFJlY29yZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy4jc2VuZERhdGFUb0tQQShzaXRlLCBpbnZhbGlkUmVjb3JkcylcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGFzeW5jICNzZW5kRGF0YVRvS1BBKHNpdGU6IHN0cmluZywgbW9kZWxzOiBLUEFVc2VyTW9kZWxbXSkgOiBQcm9taXNlPGJvb2xlYW4+IHtcblxuICAgICAgICBsZXQgaGVhZGVycyA9ICdTaXRlLFJlY29yZFR5cGUsRW1wbG95ZWVOdW1iZXIsRmlyc3ROYW1lLExhc3ROYW1lLFVzZXJuYW1lLEluaXRpYWxQYXNzd29yZCxSb2xlLFRpdGxlLEVtYWlsLFRlcm1pbmF0aW9uRGF0ZSxGb3JjZVBhc3N3b3JkU2VsZWN0aW9uLFNlbmRXZWxjb21lRW1haWwnO1xuICAgICAgICB2YXIgY29udGVudCA9IGAke2hlYWRlcnN9YDtcblxuICAgICAgICBmb3IodmFyIG1vZGVsIG9mIG1vZGVscykge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgZGF0YVVzZXIgPSBgJHtzaXRlfSxFbXBsb3llZWBcbiAgICAgICAgICAgIGRhdGFVc2VyID0gYCR7ZGF0YVVzZXJ9LCR7SGVscGVyLmNzdkNvbnRlbnRDaGVja2VyKG1vZGVsLmVtcGxveWVlTnVtYmVyKX1gXG4gICAgICAgICAgICBkYXRhVXNlciA9IGAke2RhdGFVc2VyfSwke0hlbHBlci5jc3ZDb250ZW50Q2hlY2tlcihtb2RlbC5maXJzdE5hbWUpfWBcbiAgICAgICAgICAgIGRhdGFVc2VyID0gYCR7ZGF0YVVzZXJ9LCR7SGVscGVyLmNzdkNvbnRlbnRDaGVja2VyKG1vZGVsLmxhc3ROYW1lKX1gXG4gICAgICAgICAgICBkYXRhVXNlciA9IGAke2RhdGFVc2VyfSwke0hlbHBlci5jc3ZDb250ZW50Q2hlY2tlcihtb2RlbC51c2VybmFtZSl9YFxuICAgICAgICAgICAgZGF0YVVzZXIgPSBgJHtkYXRhVXNlcn0sJHtIZWxwZXIuY3N2Q29udGVudENoZWNrZXIobW9kZWwuaW5pdGlhbFBhc3N3b3JkKX1gXG4gICAgICAgICAgICBkYXRhVXNlciA9IGAke2RhdGFVc2VyfSwke0hlbHBlci5jc3ZDb250ZW50Q2hlY2tlcihtb2RlbC5yb2xlKX1gXG4gICAgICAgICAgICBkYXRhVXNlciA9IGAke2RhdGFVc2VyfSwke0hlbHBlci5jc3ZDb250ZW50Q2hlY2tlcihtb2RlbC50aXRsZSl9YFxuICAgICAgICAgICAgZGF0YVVzZXIgPSBgJHtkYXRhVXNlcn0sJHtIZWxwZXIuY3N2Q29udGVudENoZWNrZXIobW9kZWwuZW1haWwpfWBcbiAgICAgICAgICAgIGRhdGFVc2VyID0gYCR7ZGF0YVVzZXJ9LCR7SGVscGVyLmNzdkNvbnRlbnRDaGVja2VyKG1vZGVsLnRlcm1pbmF0aW9uRGF0ZSA/PyAnJyl9YFxuICAgICAgICAgICAgZGF0YVVzZXIgPSBgJHtkYXRhVXNlcn0sJHttb2RlbC5yZXNldFBhc3N3b3JkID8gJ1knOiAnTid9YFxuICAgICAgICAgICAgZGF0YVVzZXIgPSBgJHtkYXRhVXNlcn0sJHttb2RlbC53ZWxjb21lRW1haWwgPyAnWSc6ICdOJ31gXG5cbiAgICAgICAgICAgIGNvbnRlbnQgPSBgJHtjb250ZW50fVxcbiR7ZGF0YVVzZXJ9YFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmlsZURhdGEgPSBCdWZmZXIuZnJvbShjb250ZW50LCAnYmluYXJ5JykudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLmFwaUluc3RhbmNlLnBvc3QoJ2RhdGFsb2FkLmNyZWF0ZScsIHtcbiAgICAgICAgICAgIHRva2VuOnRoaXMudG9rZW4sXG4gICAgICAgICAgICBmaWxlOiBgZGF0YTp0ZXh0L2NzdjtiYXNlNjQsJHtmaWxlRGF0YX1gLFxuICAgICAgICAgICAgZmFpbHVyZUVtYWlsczogW10sXG4gICAgICAgICAgICBzdWNjZXNzRW1haWxzOiBbXVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKVxuXG4gICAgICAgIHJldHVybiBkYXRhLm9rO1xuICAgIH1cblxufSJdfQ==