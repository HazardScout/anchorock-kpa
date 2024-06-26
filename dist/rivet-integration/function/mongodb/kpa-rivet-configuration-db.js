"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KPARivetConfigurationDB = void 0;
const mongodb_1 = require("../../../base-integration/src/mongodb");
const kpa_rivet_configuration_model_1 = require("../model/kpa-rivet-configuration-model");
class KPARivetConfigurationDB extends mongodb_1.KPABaseConfigurationDB {
    constructor() {
        super();
        this.collectionName = 'rivetconfigs';
    }
    convertData(data) {
        return new kpa_rivet_configuration_model_1.KPARivetConfigurationModel(data);
    }
}
exports.KPARivetConfigurationDB = KPARivetConfigurationDB;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3BhLXJpdmV0LWNvbmZpZ3VyYXRpb24tZGIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9yaXZldC1pbnRlZ3JhdGlvbi9mdW5jdGlvbi9tb25nb2RiL2twYS1yaXZldC1jb25maWd1cmF0aW9uLWRiLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLG1FQUErRTtBQUMvRSwwRkFBb0Y7QUFHcEYsTUFBYSx1QkFBd0IsU0FBUSxnQ0FBa0Q7SUFHM0Y7UUFDSSxLQUFLLEVBQUUsQ0FBQTtRQUNQLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO0lBQ3pDLENBQUM7SUFFRCxXQUFXLENBQUMsSUFBYztRQUN0QixPQUFPLElBQUksMERBQTBCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEQsQ0FBQztDQUVKO0FBWkQsMERBWUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEb2N1bWVudCB9IGZyb20gXCJtb25nb2RiXCI7XG5pbXBvcnQgeyBLUEFCYXNlQ29uZmlndXJhdGlvbkRCIH0gZnJvbSBcIi4uLy4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL21vbmdvZGJcIjtcbmltcG9ydCB7IEtQQVJpdmV0Q29uZmlndXJhdGlvbk1vZGVsIH0gZnJvbSBcIi4uL21vZGVsL2twYS1yaXZldC1jb25maWd1cmF0aW9uLW1vZGVsXCI7XG5cblxuZXhwb3J0IGNsYXNzIEtQQVJpdmV0Q29uZmlndXJhdGlvbkRCIGV4dGVuZHMgS1BBQmFzZUNvbmZpZ3VyYXRpb25EQjxLUEFSaXZldENvbmZpZ3VyYXRpb25Nb2RlbD4ge1xuICAgIGNvbGxlY3Rpb25OYW1lOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKVxuICAgICAgICB0aGlzLmNvbGxlY3Rpb25OYW1lID0gJ3JpdmV0Y29uZmlncyc7XG4gICAgfVxuXG4gICAgY29udmVydERhdGEoZGF0YTogRG9jdW1lbnQpOiBLUEFSaXZldENvbmZpZ3VyYXRpb25Nb2RlbCB7XG4gICAgICAgIHJldHVybiBuZXcgS1BBUml2ZXRDb25maWd1cmF0aW9uTW9kZWwoZGF0YSk7XG4gICAgfVxuICAgIFxufSJdfQ==