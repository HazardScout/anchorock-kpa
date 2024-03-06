"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KPASpectrumConfigurationModel = void 0;
const model_1 = require("../../../base-integration/src/model");
class KPASpectrumConfigurationModel extends model_1.KPABaseConfigurationModel {
    constructor(data) {
        super(data);
        this.clientId = data['client_id'];
        this.clientSecret = data['client_secret'];
    }
    syncChanges() {
        super.syncChanges();
        this.doc['client_id'] = this.clientId;
        this.doc['client_secret'] = this.clientSecret;
        return this.doc;
    }
}
exports.KPASpectrumConfigurationModel = KPASpectrumConfigurationModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3BhLXNwZWN0cnVtLWNvbmZpZ3VyYXRpb24tbW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcGVjdHJ1bS1pbnRlZ3JhdGlvbi9mdW5jdGlvbi9tb2RlbC9rcGEtc3BlY3RydW0tY29uZmlndXJhdGlvbi1tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwrREFBZ0Y7QUFFaEYsTUFBYSw2QkFBOEIsU0FBUSxpQ0FBeUI7SUFJeEUsWUFBWSxJQUFjO1FBQ3RCLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNYLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxXQUFXO1FBQ1AsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRXBCLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN0QyxJQUFJLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7UUFFOUMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ3BCLENBQUM7Q0FDSjtBQWxCRCxzRUFrQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEb2N1bWVudCB9IGZyb20gXCJtb25nb2RiXCI7XG5pbXBvcnQgeyBLUEFCYXNlQ29uZmlndXJhdGlvbk1vZGVsIH0gZnJvbSBcIi4uLy4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL21vZGVsXCI7XG5cbmV4cG9ydCBjbGFzcyBLUEFTcGVjdHJ1bUNvbmZpZ3VyYXRpb25Nb2RlbCBleHRlbmRzIEtQQUJhc2VDb25maWd1cmF0aW9uTW9kZWwge1xuICAgIGNsaWVudElkOiBzdHJpbmc7XG4gICAgY2xpZW50U2VjcmV0OiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihkYXRhOiBEb2N1bWVudCkge1xuICAgICAgICBzdXBlcihkYXRhKVxuICAgICAgICB0aGlzLmNsaWVudElkID0gZGF0YVsnY2xpZW50X2lkJ107XG4gICAgICAgIHRoaXMuY2xpZW50U2VjcmV0ID0gZGF0YVsnY2xpZW50X3NlY3JldCddO1xuICAgIH1cblxuICAgIHN5bmNDaGFuZ2VzKCk6RG9jdW1lbnQge1xuICAgICAgICBzdXBlci5zeW5jQ2hhbmdlcygpO1xuXG4gICAgICAgIHRoaXMuZG9jWydjbGllbnRfaWQnXSA9IHRoaXMuY2xpZW50SWQ7XG4gICAgICAgIHRoaXMuZG9jWydjbGllbnRfc2VjcmV0J10gPSB0aGlzLmNsaWVudFNlY3JldDtcblxuICAgICAgICByZXR1cm4gdGhpcy5kb2M7XG4gICAgfVxufVxuIl19