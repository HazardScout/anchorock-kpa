"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpectrumProjectJob = void 0;
const api_1 = require("../../../base-integration/src/api");
const api_2 = require("../api");
const model_1 = require("../../../base-integration/src/model");
const util_1 = require("util");
class SpectrumProjectJob {
    constructor(config) {
        this.config = config;
        this.kpaSite = config["kpaSite"]["stringValue"];
        this.name = 'Spectrum Project Job - ' + this.kpaSite;
        this.kpaToken = config["kpaToken"]["stringValue"];
        this.serverUrl = config["serverUrl"]["stringValue"];
        this.companyCodes = JSON.parse(config["companyCodes"]["stringValue"]);
        this.authorizationId = config["authorizationId"]["stringValue"];
        this.isEditProject = config["isEditProject"]["stringValue"] == '1';
    }
    async execute(status) {
        (0, util_1.debuglog)('log:spectrum:project')("Execute SpectrumProjectJob Start");
        //Fetch KPA Projects
        let kpaProjectAPI = new api_1.KPAProjectAPI(this.kpaToken);
        // let kpaExistProjects = await kpaProjectAPI.getAllProject();
        let kpaExistProjects = [];
        status.totalExistingRecord = kpaExistProjects.length;
        //Loop Spectrum Projects
        let kpaProjects = [];
        for (var companyCode of this.companyCodes) {
            //Fetch Spectrum Projects
            let spectrumAPI = new api_2.SpectrumAPI(this.serverUrl, this.authorizationId, companyCode);
            let projects = await spectrumAPI.getProjects();
            status.totalSourceRecord = projects.length;
            for (let project of projects) {
                var kpaProject = null;
                for (let i = 0; i < kpaExistProjects.length; i++) {
                    const kpaExistProject = kpaExistProjects[i];
                    if (kpaExistProject.code === project.jobNumber) {
                        kpaProject = kpaExistProject;
                        kpaExistProjects.splice(i, 1);
                        break;
                    }
                }
                if (kpaProject == null) {
                    kpaProject = new model_1.KPAProjectModel();
                }
                else {
                    if (!this.isEditProject) {
                        status.skippedRecord++;
                        continue;
                    }
                }
                //Build KPA project Data and Check existing
                kpaProject.name = project.jobDescription;
                kpaProject.code = project.jobNumber;
                kpaProject.isActive = project.statusCode === "A";
                kpaProject.address = project.address;
                kpaProject.city = project.city;
                kpaProject.state = project.state;
                kpaProject.zip = project.zipCode;
                //Add Projects To List
                kpaProjects.push(kpaProject);
                status.upsertRecord++;
            }
        }
        //Send Data
        (0, util_1.debuglog)('log:spectrum:project')(String(kpaProjects.length));
        const success = await kpaProjectAPI.saveProject(this.kpaSite, kpaProjects);
        if (!success) {
            throw new Error('Failed to save Projects:' + this.config.kpaSite);
        }
        (0, util_1.debuglog)('log:spectrum:project')("Execute SpectrumProjectJob Done");
    }
}
exports.SpectrumProjectJob = SpectrumProjectJob;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlY3RydW0tcHJvamVjdC1qb2IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcGVjdHJ1bS1pbnRlZ3JhdGlvbi9mdW5jdGlvbi9qb2Ivc3BlY3RydW0tcHJvamVjdC1qb2IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsMkRBQWtFO0FBQ2xFLGdDQUFxQztBQUNyQywrREFBc0U7QUFDdEUsK0JBQWdDO0FBRWhDLE1BQWEsa0JBQWtCO0lBVTNCLFlBQVksTUFBVztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUVyQixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsSUFBSSxHQUFHLHlCQUF5QixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDckQsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDcEQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsYUFBYSxDQUFDLElBQUksR0FBRyxDQUFDO0lBQ3ZFLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQWlCO1FBQzNCLElBQUEsZUFBUSxFQUFDLHNCQUFzQixDQUFDLENBQUMsa0NBQWtDLENBQUMsQ0FBQztRQUNyRSxvQkFBb0I7UUFDcEIsSUFBSSxhQUFhLEdBQUcsSUFBSSxtQkFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyRCw4REFBOEQ7UUFDOUQsSUFBSSxnQkFBZ0IsR0FBdUIsRUFBRSxDQUFDO1FBQzlDLE1BQU0sQ0FBQyxtQkFBbUIsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUE7UUFHcEQsd0JBQXdCO1FBQ3hCLElBQUksV0FBVyxHQUFzQixFQUFFLENBQUM7UUFDeEMsS0FBSyxJQUFJLFdBQVcsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDeEMseUJBQXlCO1lBQ3pCLElBQUksV0FBVyxHQUFHLElBQUksaUJBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsV0FBVyxDQUFDLENBQUE7WUFDcEYsSUFBSSxRQUFRLEdBQUcsTUFBTSxXQUFXLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDL0MsTUFBTSxDQUFDLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUE7WUFFMUMsS0FBSSxJQUFJLE9BQU8sSUFBSSxRQUFRLEVBQUUsQ0FBQztnQkFFMUIsSUFBSSxVQUFVLEdBQTRCLElBQUksQ0FBQztnQkFDL0MsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUMvQyxNQUFNLGVBQWUsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDNUMsSUFBSSxlQUFlLENBQUMsSUFBSSxLQUFLLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDN0MsVUFBVSxHQUFHLGVBQWUsQ0FBQzt3QkFDN0IsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQzt3QkFDN0IsTUFBTTtvQkFDVixDQUFDO2dCQUNMLENBQUM7Z0JBRUQsSUFBSSxVQUFVLElBQUksSUFBSSxFQUFFLENBQUM7b0JBQ3JCLFVBQVUsR0FBRyxJQUFJLHVCQUFlLEVBQUUsQ0FBQztnQkFDdkMsQ0FBQztxQkFBTSxDQUFDO29CQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7d0JBQ3RCLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQTt3QkFDdEIsU0FBUztvQkFDYixDQUFDO2dCQUNMLENBQUM7Z0JBRUQsMkNBQTJDO2dCQUMzQyxVQUFVLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUM7Z0JBQ3pDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztnQkFDcEMsVUFBVSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxLQUFLLEdBQUcsQ0FBQTtnQkFDaEQsVUFBVSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO2dCQUNyQyxVQUFVLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7Z0JBQy9CLFVBQVUsQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztnQkFDakMsVUFBVSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO2dCQUVqQyxzQkFBc0I7Z0JBQ3RCLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQzdCLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQTtZQUN6QixDQUFDO1FBQ0wsQ0FBQztRQUVELFdBQVc7UUFDWCxJQUFBLGVBQVEsRUFBQyxzQkFBc0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtRQUM1RCxNQUFNLE9BQU8sR0FBRyxNQUFNLGFBQWEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQTtRQUMxRSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDWCxNQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEUsQ0FBQztRQUNELElBQUEsZUFBUSxFQUFDLHNCQUFzQixDQUFDLENBQUMsaUNBQWlDLENBQUMsQ0FBQztJQUN4RSxDQUFDO0NBRUo7QUFwRkQsZ0RBb0ZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUpvYiwgSm9iU3RhdHVzIH0gZnJvbSBcIi4uLy4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL2pvYlwiO1xuaW1wb3J0IHsgS1BBUHJvamVjdEFQSSB9IGZyb20gXCIuLi8uLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy9hcGlcIjtcbmltcG9ydCB7IFNwZWN0cnVtQVBJIH0gZnJvbSBcIi4uL2FwaVwiO1xuaW1wb3J0IHsgS1BBUHJvamVjdE1vZGVsIH0gZnJvbSBcIi4uLy4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL21vZGVsXCI7XG5pbXBvcnQgeyBkZWJ1Z2xvZyB9IGZyb20gJ3V0aWwnO1xuXG5leHBvcnQgY2xhc3MgU3BlY3RydW1Qcm9qZWN0Sm9iIGltcGxlbWVudHMgSUpvYiB7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGtwYVNpdGU6IHN0cmluZztcbiAgICBrcGFUb2tlbjogc3RyaW5nO1xuICAgIHNlcnZlclVybDogc3RyaW5nO1xuICAgIGNvbXBhbnlDb2Rlczogc3RyaW5nW107XG4gICAgYXV0aG9yaXphdGlvbklkOiBzdHJpbmc7XG4gICAgaXNFZGl0UHJvamVjdDogYm9vbGVhbjtcbiAgICBjb25maWc6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogYW55KSB7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuXG4gICAgICAgIHRoaXMua3BhU2l0ZSA9IGNvbmZpZ1tcImtwYVNpdGVcIl1bXCJzdHJpbmdWYWx1ZVwiXTtcbiAgICAgICAgdGhpcy5uYW1lID0gJ1NwZWN0cnVtIFByb2plY3QgSm9iIC0gJyArIHRoaXMua3BhU2l0ZTtcbiAgICAgICAgdGhpcy5rcGFUb2tlbiA9IGNvbmZpZ1tcImtwYVRva2VuXCJdW1wic3RyaW5nVmFsdWVcIl07XG4gICAgICAgIHRoaXMuc2VydmVyVXJsID0gY29uZmlnW1wic2VydmVyVXJsXCJdW1wic3RyaW5nVmFsdWVcIl07XG4gICAgICAgIHRoaXMuY29tcGFueUNvZGVzID0gSlNPTi5wYXJzZShjb25maWdbXCJjb21wYW55Q29kZXNcIl1bXCJzdHJpbmdWYWx1ZVwiXSk7XG4gICAgICAgIHRoaXMuYXV0aG9yaXphdGlvbklkID0gY29uZmlnW1wiYXV0aG9yaXphdGlvbklkXCJdW1wic3RyaW5nVmFsdWVcIl07XG4gICAgICAgIHRoaXMuaXNFZGl0UHJvamVjdCA9IGNvbmZpZ1tcImlzRWRpdFByb2plY3RcIl1bXCJzdHJpbmdWYWx1ZVwiXSA9PSAnMSc7XG4gICAgfVxuXG4gICAgYXN5bmMgZXhlY3V0ZShzdGF0dXM6IEpvYlN0YXR1cyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBkZWJ1Z2xvZygnbG9nOnNwZWN0cnVtOnByb2plY3QnKShcIkV4ZWN1dGUgU3BlY3RydW1Qcm9qZWN0Sm9iIFN0YXJ0XCIpO1xuICAgICAgICAvL0ZldGNoIEtQQSBQcm9qZWN0c1xuICAgICAgICBsZXQga3BhUHJvamVjdEFQSSA9IG5ldyBLUEFQcm9qZWN0QVBJKHRoaXMua3BhVG9rZW4pO1xuICAgICAgICAvLyBsZXQga3BhRXhpc3RQcm9qZWN0cyA9IGF3YWl0IGtwYVByb2plY3RBUEkuZ2V0QWxsUHJvamVjdCgpO1xuICAgICAgICBsZXQga3BhRXhpc3RQcm9qZWN0cyA6IEtQQVByb2plY3RNb2RlbFtdID0gW107XG4gICAgICAgIHN0YXR1cy50b3RhbEV4aXN0aW5nUmVjb3JkID0ga3BhRXhpc3RQcm9qZWN0cy5sZW5ndGhcblxuXG4gICAgICAgIC8vTG9vcCBTcGVjdHJ1bSBQcm9qZWN0c1xuICAgICAgICBsZXQga3BhUHJvamVjdHM6IEtQQVByb2plY3RNb2RlbFtdID0gW107XG4gICAgICAgIGZvciAodmFyIGNvbXBhbnlDb2RlIG9mIHRoaXMuY29tcGFueUNvZGVzKSB7XG4gICAgICAgICAgICAvL0ZldGNoIFNwZWN0cnVtIFByb2plY3RzXG4gICAgICAgICAgICBsZXQgc3BlY3RydW1BUEkgPSBuZXcgU3BlY3RydW1BUEkodGhpcy5zZXJ2ZXJVcmwsIHRoaXMuYXV0aG9yaXphdGlvbklkLCBjb21wYW55Q29kZSlcbiAgICAgICAgICAgIGxldCBwcm9qZWN0cyA9IGF3YWl0IHNwZWN0cnVtQVBJLmdldFByb2plY3RzKCk7XG4gICAgICAgICAgICBzdGF0dXMudG90YWxTb3VyY2VSZWNvcmQgPSBwcm9qZWN0cy5sZW5ndGhcblxuICAgICAgICAgICAgZm9yKGxldCBwcm9qZWN0IG9mIHByb2plY3RzKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIga3BhUHJvamVjdCA6IEtQQVByb2plY3RNb2RlbCB8IG51bGwgPSBudWxsO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga3BhRXhpc3RQcm9qZWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBrcGFFeGlzdFByb2plY3QgPSBrcGFFeGlzdFByb2plY3RzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoa3BhRXhpc3RQcm9qZWN0LmNvZGUgPT09IHByb2plY3Quam9iTnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrcGFQcm9qZWN0ID0ga3BhRXhpc3RQcm9qZWN0O1xuICAgICAgICAgICAgICAgICAgICAgICAga3BhRXhpc3RQcm9qZWN0cy5zcGxpY2UoaSwxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGtwYVByb2plY3QgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBrcGFQcm9qZWN0ID0gbmV3IEtQQVByb2plY3RNb2RlbCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc0VkaXRQcm9qZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXMuc2tpcHBlZFJlY29yZCsrXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vQnVpbGQgS1BBIHByb2plY3QgRGF0YSBhbmQgQ2hlY2sgZXhpc3RpbmdcbiAgICAgICAgICAgICAgICBrcGFQcm9qZWN0Lm5hbWUgPSBwcm9qZWN0LmpvYkRlc2NyaXB0aW9uO1xuICAgICAgICAgICAgICAgIGtwYVByb2plY3QuY29kZSA9IHByb2plY3Quam9iTnVtYmVyO1xuICAgICAgICAgICAgICAgIGtwYVByb2plY3QuaXNBY3RpdmUgPSBwcm9qZWN0LnN0YXR1c0NvZGUgPT09IFwiQVwiXG4gICAgICAgICAgICAgICAga3BhUHJvamVjdC5hZGRyZXNzID0gcHJvamVjdC5hZGRyZXNzO1xuICAgICAgICAgICAgICAgIGtwYVByb2plY3QuY2l0eSA9IHByb2plY3QuY2l0eTtcbiAgICAgICAgICAgICAgICBrcGFQcm9qZWN0LnN0YXRlID0gcHJvamVjdC5zdGF0ZTtcbiAgICAgICAgICAgICAgICBrcGFQcm9qZWN0LnppcCA9IHByb2plY3QuemlwQ29kZTtcblxuICAgICAgICAgICAgICAgIC8vQWRkIFByb2plY3RzIFRvIExpc3RcbiAgICAgICAgICAgICAgICBrcGFQcm9qZWN0cy5wdXNoKGtwYVByb2plY3QpO1xuICAgICAgICAgICAgICAgIHN0YXR1cy51cHNlcnRSZWNvcmQrK1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9TZW5kIERhdGFcbiAgICAgICAgZGVidWdsb2coJ2xvZzpzcGVjdHJ1bTpwcm9qZWN0JykoU3RyaW5nKGtwYVByb2plY3RzLmxlbmd0aCkpXG4gICAgICAgIGNvbnN0IHN1Y2Nlc3MgPSBhd2FpdCBrcGFQcm9qZWN0QVBJLnNhdmVQcm9qZWN0KHRoaXMua3BhU2l0ZSwga3BhUHJvamVjdHMpXG4gICAgICAgIGlmICghc3VjY2Vzcykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gc2F2ZSBQcm9qZWN0czonICsgdGhpcy5jb25maWcua3BhU2l0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZGVidWdsb2coJ2xvZzpzcGVjdHJ1bTpwcm9qZWN0JykoXCJFeGVjdXRlIFNwZWN0cnVtUHJvamVjdEpvYiBEb25lXCIpO1xuICAgIH1cblxufVxuIl19