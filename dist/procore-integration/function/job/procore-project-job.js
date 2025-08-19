"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcoreProjectJob = void 0;
const model_1 = require("../../../base-integration/src/model");
const api_1 = require("../api");
const model_2 = require("../model");
const mongodb_1 = require("../mongodb");
const api_2 = require("../../../base-integration/src/api");
class ProcoreProjectJob {
    constructor(config) {
        this.name = "Procore Project Job - " + config.kpaSite;
        this.config = config;
    }
    async execute(status) {
        //Fetch KPA Projects
        let kpaProjectAPI = new api_2.KPAProjectAPI(this.config.kpaToken);
        let kpaExistProjects = await kpaProjectAPI.getAllProject();
        // let kpaExistProjects : KPAProjectModel[] = [];
        status.totalExistingRecord = kpaExistProjects.length;
        let auth = new model_2.procoreContext(this.config.procoreToken, this.config.procoreRefreshToken);
        let procoreAPI = new api_1.ProcoreAPI(auth, async (newAuth) => {
            this.config.procoreToken = newAuth.accessToken;
            this.config.procoreRefreshToken = newAuth.refreshToken;
            let db = new mongodb_1.KPAProcoreConfigurationDB();
            await db.updateProcoreToken(this.config);
        });
        let companies = await procoreAPI.getCompanies();
        status.totalSourceRecord = 0;
        for (let company of companies) {
            for (let procoreCompanyId of this.config.procoreCompanyIds) {
                if (procoreCompanyId === company.id) {
                    let projects = await procoreAPI.getProjects(company.id);
                    status.totalSourceRecord += projects.length;
                    let kpaProjects = [];
                    for (let project of projects) {
                        //Build KPA project Data and Check existing
                        var kpaProject = null;
                        for (let i = 0; i < kpaExistProjects.length; i++) {
                            const kpaExistProject = kpaExistProjects[i];
                            if (kpaExistProject.number && kpaExistProject.number === project.project_number) {
                                kpaProject = kpaExistProject;
                                kpaExistProjects.splice(i, 1);
                                break;
                            }
                        }
                        // Check if its new project
                        if (kpaProject == null) {
                            // if its inactive, then ignore
                            if (!project.active) {
                                status.skippedRecord++;
                                continue;
                            }
                            kpaProject = new model_1.KPAProjectModel();
                        }
                        kpaProject.name = project.name;
                        kpaProject.code = project.project_number;
                        kpaProject.isActive = project.active;
                        kpaProject.active = project.active;
                        kpaProject.address = project.address;
                        kpaProject.city = project.city;
                        kpaProject.state = project.state_code;
                        kpaProject.zip = project.zip;
                        kpaProjects.push(kpaProject);
                        status.upsertRecord++;
                    }
                    //Send Data
                    const success = await kpaProjectAPI.saveProject(this.config.kpaSite, kpaProjects);
                    if (!success) {
                        throw new Error('Failed to save Projects:' + this.config.kpaSite);
                    }
                }
            }
        }
    }
}
exports.ProcoreProjectJob = ProcoreProjectJob;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY29yZS1wcm9qZWN0LWpvYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2NvcmUtaW50ZWdyYXRpb24vZnVuY3Rpb24vam9iL3Byb2NvcmUtcHJvamVjdC1qb2IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsK0RBQXNFO0FBQ3RFLGdDQUFvQztBQUNwQyxvQ0FBd0U7QUFDeEUsd0NBQXVEO0FBQ3ZELDJEQUFrRTtBQUdsRSxNQUFhLGlCQUFpQjtJQUkxQixZQUFZLE1BQW9DO1FBQzVDLElBQUksQ0FBQyxJQUFJLEdBQUcsd0JBQXdCLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUN0RCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN6QixDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFpQjtRQUMzQixvQkFBb0I7UUFDcEIsSUFBSSxhQUFhLEdBQUcsSUFBSSxtQkFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUQsSUFBSSxnQkFBZ0IsR0FBRyxNQUFNLGFBQWEsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUMzRCxpREFBaUQ7UUFDakQsTUFBTSxDQUFDLG1CQUFtQixHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQTtRQUVwRCxJQUFJLElBQUksR0FBRyxJQUFJLHNCQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3pGLElBQUksVUFBVSxHQUFHLElBQUksZ0JBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFO1lBQ3BELElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7WUFDL0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDO1lBRXZE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LENBQUMsQ0FBQztvQkFDdEUsQ0FBQztnQkFDTCxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0NBRUo7QUE5RUQsOENBOEVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUpvYiB9IGZyb20gXCIuLi8uLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy9qb2JcIjtcbmltcG9ydCB7IEtQQVByb2plY3RNb2RlbCB9IGZyb20gXCIuLi8uLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy9tb2RlbFwiO1xuaW1wb3J0IHsgUHJvY29yZUFQSSB9IGZyb20gXCIuLi9hcGlcIjtcbmltcG9ydCB7IEtQQVByb2NvcmVDb25maWd1cmF0aW9uTW9kZWwsIHByb2NvcmVDb250ZXh0IH0gZnJvbSBcIi4uL21vZGVsXCI7XG5pbXBvcnQgeyBLUEFQcm9jb3JlQ29uZmlndXJhdGlvbkRCIH0gZnJvbSBcIi4uL21vbmdvZGJcIjtcbmltcG9ydCB7IEtQQVByb2plY3RBUEkgfSBmcm9tIFwiLi4vLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvYXBpXCI7XG5pbXBvcnQgeyBKb2JTdGF0dXMgfSBmcm9tIFwiLi4vLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvam9iXCI7XG5cbmV4cG9ydCBjbGFzcyBQcm9jb3JlUHJvamVjdEpvYiBpbXBsZW1lbnRzIElKb2IgIHtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgY29uZmlnOiBLUEFQcm9jb3JlQ29uZmlndXJhdGlvbk1vZGVsO1xuXG4gICAgY29uc3RydWN0b3IoY29uZmlnOiBLUEFQcm9jb3JlQ29uZmlndXJhdGlvbk1vZGVsKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IFwiUHJvY29yZSBQcm9qZWN0IEpvYiAtIFwiICsgY29uZmlnLmtwYVNpdGU7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIH1cblxuICAgIGFzeW5jIGV4ZWN1dGUoc3RhdHVzOiBKb2JTdGF0dXMpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgLy9GZXRjaCBLUEEgUHJvamVjdHNcbiAgICAgICAgbGV0IGtwYVByb2plY3RBUEkgPSBuZXcgS1BBUHJvamVjdEFQSSh0aGlzLmNvbmZpZy5rcGFUb2tlbik7XG4gICAgICAgIGxldCBrcGFFeGlzdFByb2plY3RzID0gYXdhaXQga3BhUHJvamVjdEFQSS5nZXRBbGxQcm9qZWN0KCk7XG4gICAgICAgIC8vIGxldCBrcGFFeGlzdFByb2plY3RzIDogS1BBUHJvamVjdE1vZGVsW10gPSBbXTtcbiAgICAgICAgc3RhdHVzLnRvdGFsRXhpc3RpbmdSZWNvcmQgPSBrcGFFeGlzdFByb2plY3RzLmxlbmd0aFxuXG4gICAgICAgIGxldCBhdXRoID0gbmV3IHByb2NvcmVDb250ZXh0KHRoaXMuY29uZmlnLnByb2NvcmVUb2tlbiwgdGhpcy5jb25maWcucHJvY29yZVJlZnJlc2hUb2tlbik7XG4gICAgICAgIGxldCBwcm9jb3JlQVBJID0gbmV3IFByb2NvcmVBUEkoYXV0aCwgYXN5bmMgKG5ld0F1dGgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLnByb2NvcmVUb2tlbiA9IG5ld0F1dGguYWNjZXNzVG9rZW47XG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5wcm9jb3JlUmVmcmVzaFRva2VuID0gbmV3QXV0aC5yZWZyZXNoVG9rZW47XG5cbiAgICAgICAgICAgIGxldCBkYiA9IG5ldyBLUEFQcm9jb3JlQ29uZmlndXJhdGlvbkRCKCk7XG4gICAgICAgICAgICBhd2FpdCBkYi51cGRhdGVQcm9jb3JlVG9rZW4odGhpcy5jb25maWcpO1xuICAgICAgICB9KVxuICAgICAgICBsZXQgY29tcGFuaWVzID0gYXdhaXQgcHJvY29yZUFQSS5nZXRDb21wYW5pZXMoKTtcbiAgICAgICAgc3RhdHVzLnRvdGFsU291cmNlUmVjb3JkID0gMFxuICAgICAgICBmb3IobGV0IGNvbXBhbnkgb2YgY29tcGFuaWVzKSB7XG4gICAgICAgICAgICBmb3IobGV0IHByb2NvcmVDb21wYW55SWQgb2YgdGhpcy5jb25maWcucHJvY29yZUNvbXBhbnlJZHMpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvY29yZUNvbXBhbnlJZCA9PT0gY29tcGFueS5pZCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcHJvamVjdHMgPSBhd2FpdCBwcm9jb3JlQVBJLmdldFByb2plY3RzKGNvbXBhbnkuaWQpO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMudG90YWxTb3VyY2VSZWNvcmQgKz0gcHJvamVjdHMubGVuZ3RoXG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGtwYVByb2plY3RzOiBLUEFQcm9qZWN0TW9kZWxbXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHByb2plY3Qgb2YgcHJvamVjdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vQnVpbGQgS1BBIHByb2plY3QgRGF0YSBhbmQgQ2hlY2sgZXhpc3RpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBrcGFQcm9qZWN0IDogS1BBUHJvamVjdE1vZGVsIHwgbnVsbCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtwYUV4aXN0UHJvamVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrcGFFeGlzdFByb2plY3QgPSBrcGFFeGlzdFByb2plY3RzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrcGFFeGlzdFByb2plY3QubnVtYmVyICYmIGtwYUV4aXN0UHJvamVjdC5udW1iZXIgPT09IHByb2plY3QucHJvamVjdF9udW1iZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga3BhUHJvamVjdCA9IGtwYUV4aXN0UHJvamVjdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga3BhRXhpc3RQcm9qZWN0cy5zcGxpY2UoaSwxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBpdHMgbmV3IHByb2plY3RcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrcGFQcm9qZWN0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBpdHMgaW5hY3RpdmUsIHRoZW4gaWdub3JlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFwcm9qZWN0LmFjdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXMuc2tpcHBlZFJlY29yZCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga3BhUHJvamVjdCA9IG5ldyBLUEFQcm9qZWN0TW9kZWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAga3BhUHJvamVjdC5uYW1lID0gcHJvamVjdC5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAga3BhUHJvamVjdC5jb2RlID0gcHJvamVjdC5wcm9qZWN0X251bWJlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtwYVByb2plY3QuaXNBY3RpdmUgPSBwcm9qZWN0LmFjdGl2ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtwYVByb2plY3QuYWN0aXZlID0gcHJvamVjdC5hY3RpdmU7XG4gICAgICAgICAgICAgICAgICAgICAgICBrcGFQcm9qZWN0LmFkZHJlc3MgPSBwcm9qZWN0LmFkZHJlc3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBrcGFQcm9qZWN0LmNpdHkgPSBwcm9qZWN0LmNpdHk7XG4gICAgICAgICAgICAgICAgICAgICAgICBrcGFQcm9qZWN0LnN0YXRlID0gcHJvamVjdC5zdGF0ZV9jb2RlO1xuICAgICAgICAgICAgICAgICAgICAgICAga3BhUHJvamVjdC56aXAgPSBwcm9qZWN0LnppcDtcblxuICAgICAgICAgICAgICAgICAgICAgICAga3BhUHJvamVjdHMucHVzaChrcGFQcm9qZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cy51cHNlcnRSZWNvcmQrK1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy9TZW5kIERhdGFcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3VjY2VzcyA9IGF3YWl0IGtwYVByb2plY3RBUEkuc2F2ZVByb2plY3QodGhpcy5jb25maWcua3BhU2l0ZSwga3BhUHJvamVjdHMpXG4gICAgICAgICAgICAgICAgICAgIGlmICghc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gc2F2ZSBQcm9qZWN0czonICsgdGhpcy5jb25maWcua3BhU2l0ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiJdfQ==