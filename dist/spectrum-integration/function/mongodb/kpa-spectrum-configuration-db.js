"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KPASpectrumConfigurationDB = void 0;
const mongodb_1 = require("../../../base-integration/src/mongodb");
const model_1 = require("../model");
class KPASpectrumConfigurationDB extends mongodb_1.KPABaseConfigurationDB {
    constructor() {
        super();
        this.collectionName = 'spectrumconfigs';
    }
    convertData(data) {
        return new model_1.KPASpectrumConfigurationModel(data);
    }
}
exports.KPASpectrumConfigurationDB = KPASpectrumConfigurationDB;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3BhLXNwZWN0cnVtLWNvbmZpZ3VyYXRpb24tZGIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcGVjdHJ1bS1pbnRlZ3JhdGlvbi9mdW5jdGlvbi9tb25nb2RiL2twYS1zcGVjdHJ1bS1jb25maWd1cmF0aW9uLWRiLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLG1FQUErRTtBQUMvRSxvQ0FBeUQ7QUFHekQsTUFBYSwwQkFBMkIsU0FBUSxnQ0FBcUQ7SUFHakc7UUFDSSxLQUFLLEVBQUUsQ0FBQTtRQUNQLElBQUksQ0FBQyxjQUFjLEdBQUcsaUJBQWlCLENBQUM7SUFDNUMsQ0FBQztJQUVELFdBQVcsQ0FBQyxJQUFjO1FBQ3RCLE9BQU8sSUFBSSxxQ0FBNkIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuRCxDQUFDO0NBRUo7QUFaRCxnRUFZQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERvY3VtZW50IH0gZnJvbSBcIm1vbmdvZGJcIjtcbmltcG9ydCB7IEtQQUJhc2VDb25maWd1cmF0aW9uREIgfSBmcm9tIFwiLi4vLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvbW9uZ29kYlwiO1xuaW1wb3J0IHsgS1BBU3BlY3RydW1Db25maWd1cmF0aW9uTW9kZWwgfSBmcm9tIFwiLi4vbW9kZWxcIjtcblxuXG5leHBvcnQgY2xhc3MgS1BBU3BlY3RydW1Db25maWd1cmF0aW9uREIgZXh0ZW5kcyBLUEFCYXNlQ29uZmlndXJhdGlvbkRCPEtQQVNwZWN0cnVtQ29uZmlndXJhdGlvbk1vZGVsPiB7XG4gICAgY29sbGVjdGlvbk5hbWU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpXG4gICAgICAgIHRoaXMuY29sbGVjdGlvbk5hbWUgPSAnc3BlY3RydW1jb25maWdzJztcbiAgICB9XG5cbiAgICBjb252ZXJ0RGF0YShkYXRhOiBEb2N1bWVudCk6IEtQQVNwZWN0cnVtQ29uZmlndXJhdGlvbk1vZGVsIHtcbiAgICAgICAgcmV0dXJuIG5ldyBLUEFTcGVjdHJ1bUNvbmZpZ3VyYXRpb25Nb2RlbChkYXRhKTtcbiAgICB9XG4gICAgXG59Il19