"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RivetProjectJob = void 0;
const api_1 = require("../../../base-integration/src/api");
const api_2 = require("../api");
const model_1 = require("../../../base-integration/src/model");
class RivetProjectJob {
    constructor(config) {
        this.name = 'Rivet Project Job';
        this.config = config;
        this.kpaSite = config["kpaSite"]["stringValue"];
        this.kpaToken = config["kpaToken"]["stringValue"];
        this.clientId = config["clientId"]["stringValue"];
        this.token = config["token"]["stringValue"];
        this.isEditProject = config["isEditProject"]["stringValue"] == '1';
    }
    async execute(status) {
        console.log("Execute RivetProjectJob Start");
        try {
            let kpaProjectAPI = new api_1.KPAProjectAPI(this.kpaToken);
            // let kpaExistProjects = await kpaProjectAPI.getAllProject();
            let kpaExistProjects = [];
            status.totalExistingRecord = kpaExistProjects.length;
            console.log(kpaExistProjects);
            let rivetAPI = new api_2.RivetAPI(this.clientId, this.token);
            let projects = await rivetAPI.getProjects();
            status.totalSourceRecord = projects.length;
            let kpaProjects = [];
            for (let project of projects) {
                if (project.jobName.startsWith('*') === true) {
                    status.skippedRecord++;
                    continue;
                }
                var kpaProject = null;
                for (let i = 0; i < kpaExistProjects.length; i++) {
                    const kpaExistProject = kpaExistProjects[i];
                    if (kpaExistProject.name === project.jobName && kpaExistProject.code === project.jobNumber) {
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
                        // console.log(`Skip Project because of Cannot Allow to edit ${project.jobName}`)
                        status.skippedRecord++;
                        continue;
                    }
                }
                if (project.jobName.includes("\"")) {
                    project.jobName = project.jobName.replace("\"", "'");
                }
                //Build KPA project Data and Check existing
                kpaProject.name = project.jobName;
                kpaProject.code = project.jobNumber;
                kpaProject.isActive = project.jobStatus === 'In-Progress';
                kpaProject.address = project.address;
                kpaProject.city = project.city;
                kpaProject.state = project.state;
                kpaProject.zip = project.zip;
                kpaProjects.push(kpaProject);
                status.upsertRecord++;
            }
            //Send Data
            console.log(kpaProjects.length);
            const success = await kpaProjectAPI.saveProject(this.kpaSite, kpaProjects);
            if (!success) {
                console.log('Failed to save Project');
            }
        }
        catch (e) {
            console.log(`Worker Stop with Error : ${e}`);
            //Send an email to failed;
        }
        console.log("Execute RivetProjectJob Done");
    }
}
exports.RivetProjectJob = RivetProjectJob;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicml2ZXQtcHJvamVjdC1qb2IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9yaXZldC1pbnRlZ3JhdGlvbi9mdW5jdGlvbi9qb2Ivcml2ZXQtcHJvamVjdC1qb2IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkRBQWtFO0FBQ2xFLGdDQUFrQztBQUVsQywrREFBc0U7QUFJdEUsTUFBYSxlQUFlO0lBU3hCLFlBQVksTUFBVztRQUNuQixJQUFJLENBQUMsSUFBSSxHQUFHLG1CQUFtQixDQUFDO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRXJCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEdBQUcsQ0FBQztJQUN2RSxDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFnQjtRQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDO1lBRUQsSUFBSSxhQUFhLEdBQUcsSUFBSSxtQkFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNyRCw4REFBOEQ7WUFDOUQsSUFBSSxnQkFBZ0IsR0FBdUIsRUFBRSxDQUFDO1lBQzlDLE1BQU0sQ0FBQyxtQkFBbUIsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFN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QUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUE7WUFDekMsQ0FBQztRQUNMLENBQUM7UUFBQyxPQUFNLENBQUMsRUFBRSxDQUFDO1lBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUM1QywwQkFBMEI7UUFDOUIsQ0FBQztRQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUMsQ0FBQztJQUNoRCxDQUFDO0NBRUo7QUE1RkQsMENBNEZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgS1BBUHJvamVjdEFQSSB9IGZyb20gXCIuLi8uLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy9hcGlcIjtcbmltcG9ydCB7IFJpdmV0QVBJIH0gZnJvbSBcIi4uL2FwaVwiO1xuaW1wb3J0IHsgS1BBUml2ZXRDb25maWd1cmF0aW9uTW9kZWwgfSBmcm9tIFwiLi4vbW9kZWxcIjtcbmltcG9ydCB7IEtQQVByb2plY3RNb2RlbCB9IGZyb20gXCIuLi8uLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy9tb2RlbFwiO1xuaW1wb3J0IHsgSUpvYiB9IGZyb20gXCIuLi8uLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy9qb2Ivam9iLWludGVyZmFjZVwiO1xuaW1wb3J0IHsgSm9iU3RhdHVzIH0gZnJvbSBcIi4uLy4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL2pvYlwiO1xuXG5leHBvcnQgY2xhc3MgUml2ZXRQcm9qZWN0Sm9iIGltcGxlbWVudHMgSUpvYiB7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGtwYVNpdGU6IHN0cmluZztcbiAgICBrcGFUb2tlbjogc3RyaW5nO1xuICAgIGNsaWVudElkOiBzdHJpbmc7XG4gICAgdG9rZW46IHN0cmluZztcbiAgICBpc0VkaXRQcm9qZWN0OiBib29sZWFuO1xuICAgIGNvbmZpZzogYW55O1xuXG4gICAgY29uc3RydWN0b3IoY29uZmlnOiBhbnkpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gJ1JpdmV0IFByb2plY3QgSm9iJztcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG5cbiAgICAgICAgdGhpcy5rcGFTaXRlID0gY29uZmlnW1wia3BhU2l0ZVwiXVtcInN0cmluZ1ZhbHVlXCJdO1xuICAgICAgICB0aGlzLmtwYVRva2VuID0gY29uZmlnW1wia3BhVG9rZW5cIl1bXCJzdHJpbmdWYWx1ZVwiXTtcbiAgICAgICAgdGhpcy5jbGllbnRJZCA9IGNvbmZpZ1tcImNsaWVudElkXCJdW1wic3RyaW5nVmFsdWVcIl07XG4gICAgICAgIHRoaXMudG9rZW4gPSBjb25maWdbXCJ0b2tlblwiXVtcInN0cmluZ1ZhbHVlXCJdO1xuICAgICAgICB0aGlzLmlzRWRpdFByb2plY3QgPSBjb25maWdbXCJpc0VkaXRQcm9qZWN0XCJdW1wic3RyaW5nVmFsdWVcIl0gPT0gJzEnO1xuICAgIH1cblxuICAgIGFzeW5jIGV4ZWN1dGUoc3RhdHVzOkpvYlN0YXR1cyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkV4ZWN1dGUgUml2ZXRQcm9qZWN0Sm9iIFN0YXJ0XCIpO1xuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICBsZXQga3BhUHJvamVjdEFQSSA9IG5ldyBLUEFQcm9qZWN0QVBJKHRoaXMua3BhVG9rZW4pO1xuICAgICAgICAgICAgLy8gbGV0IGtwYUV4aXN0UHJvamVjdHMgPSBhd2FpdCBrcGFQcm9qZWN0QVBJLmdldEFsbFByb2plY3QoKTtcbiAgICAgICAgICAgIGxldCBrcGFFeGlzdFByb2plY3RzIDogS1BBUHJvamVjdE1vZGVsW10gPSBbXTtcbiAgICAgICAgICAgIHN0YXR1cy50b3RhbEV4aXN0aW5nUmVjb3JkID0ga3BhRXhpc3RQcm9qZWN0cy5sZW5ndGhcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGtwYUV4aXN0UHJvamVjdHMpXG5cbiAgICAgICAgICAgIGxldCByaXZldEFQSSA9IG5ldyBSaXZldEFQSSh0aGlzLmNsaWVudElkLCB0aGlzLnRva2VuKTtcbiAgICAgICAgICAgIGxldCBwcm9qZWN0cyA9IGF3YWl0IHJpdmV0QVBJLmdldFByb2plY3RzKCk7XG4gICAgICAgICAgICBzdGF0dXMudG90YWxTb3VyY2VSZWNvcmQgPSBwcm9qZWN0cy5sZW5ndGhcblxuICAgICAgICAgICAgbGV0IGtwYVByb2plY3RzOiBLUEFQcm9qZWN0TW9kZWxbXSA9IFtdO1xuICAgICAgICAgICAgZm9yKGxldCBwcm9qZWN0IG9mIHByb2plY3RzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByb2plY3Quam9iTmFtZS5zdGFydHNXaXRoKCcqJykgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLnNraXBwZWRSZWNvcmQrK1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBrcGFQcm9qZWN0IDogS1BBUHJvamVjdE1vZGVsIHwgbnVsbCA9IG51bGw7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrcGFFeGlzdFByb2plY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGtwYUV4aXN0UHJvamVjdCA9IGtwYUV4aXN0UHJvamVjdHNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChrcGFFeGlzdFByb2plY3QubmFtZSA9PT0gcHJvamVjdC5qb2JOYW1lICYmIGtwYUV4aXN0UHJvamVjdC5jb2RlID09PSBwcm9qZWN0LmpvYk51bWJlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAga3BhUHJvamVjdCA9IGtwYUV4aXN0UHJvamVjdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtwYUV4aXN0UHJvamVjdHMuc3BsaWNlKGksMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChrcGFQcm9qZWN0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAga3BhUHJvamVjdCA9IG5ldyBLUEFQcm9qZWN0TW9kZWwoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNFZGl0UHJvamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYFNraXAgUHJvamVjdCBiZWNhdXNlIG9mIENhbm5vdCBBbGxvdyB0byBlZGl0ICR7cHJvamVjdC5qb2JOYW1lfWApXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXMuc2tpcHBlZFJlY29yZCsrXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChwcm9qZWN0LmpvYk5hbWUuaW5jbHVkZXMoXCJcXFwiXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb2plY3Quam9iTmFtZSA9IHByb2plY3Quam9iTmFtZS5yZXBsYWNlKFwiXFxcIlwiLCBcIidcIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy9CdWlsZCBLUEEgcHJvamVjdCBEYXRhIGFuZCBDaGVjayBleGlzdGluZ1xuICAgICAgICAgICAgICAgIGtwYVByb2plY3QubmFtZSA9IHByb2plY3Quam9iTmFtZTtcbiAgICAgICAgICAgICAgICBrcGFQcm9qZWN0LmNvZGUgPSBwcm9qZWN0LmpvYk51bWJlcjtcbiAgICAgICAgICAgICAgICBrcGFQcm9qZWN0LmlzQWN0aXZlID0gcHJvamVjdC5qb2JTdGF0dXMgPT09ICdJbi1Qcm9ncmVzcydcbiAgICAgICAgICAgICAgICBrcGFQcm9qZWN0LmFkZHJlc3MgPSBwcm9qZWN0LmFkZHJlc3M7XG4gICAgICAgICAgICAgICAga3BhUHJvamVjdC5jaXR5ID0gcHJvamVjdC5jaXR5O1xuICAgICAgICAgICAgICAgIGtwYVByb2plY3Quc3RhdGUgPSBwcm9qZWN0LnN0YXRlO1xuICAgICAgICAgICAgICAgIGtwYVByb2plY3QuemlwID0gcHJvamVjdC56aXA7XG5cbiAgICAgICAgICAgICAgICBrcGFQcm9qZWN0cy5wdXNoKGtwYVByb2plY3QpO1xuICAgICAgICAgICAgICAgIHN0YXR1cy51cHNlcnRSZWNvcmQrK1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL1NlbmQgRGF0YVxuICAgICAgICAgICAgY29uc29sZS5sb2coa3BhUHJvamVjdHMubGVuZ3RoKVxuICAgICAgICAgICAgY29uc3Qgc3VjY2VzcyA9IGF3YWl0IGtwYVByb2plY3RBUEkuc2F2ZVByb2plY3QodGhpcy5rcGFTaXRlLCBrcGFQcm9qZWN0cylcbiAgICAgICAgICAgIGlmICghc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gc2F2ZSBQcm9qZWN0JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgV29ya2VyIFN0b3Agd2l0aCBFcnJvciA6ICR7ZX1gKVxuICAgICAgICAgICAgLy9TZW5kIGFuIGVtYWlsIHRvIGZhaWxlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRXhlY3V0ZSBSaXZldFByb2plY3RKb2IgRG9uZVwiKTtcbiAgICB9XG5cbn0iXX0=