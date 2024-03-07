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
        this.name = "Procore Project Job";
        this.config = config;
    }
    async execute(status) {
        try {
            //Fetch KPA Projects
            let kpaProjectAPI = new api_2.KPAProjectAPI(this.config.kpaToken);
            // let kpaExistProjects = await kpaProjectAPI.getAllProject();
            let kpaExistProjects = [];
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
                            //Ignore Project without job number
                            if (project.project_number === null || project.project_number === '') {
                                status.skippedRecord++;
                                continue;
                            }
                            //Build KPA project Data and Check existing
                            var kpaProject = null;
                            for (let i = 0; i < kpaExistProjects.length; i++) {
                                const kpaExistProject = kpaExistProjects[i];
                                if (kpaExistProject.name === project.name && kpaExistProject.code === project.project_number) {
                                    kpaProject = kpaExistProject;
                                    kpaExistProjects.splice(i, 1);
                                    break;
                                }
                            }
                            if (kpaProject == null) {
                                kpaProject = new model_1.KPAProjectModel();
                            }
                            else {
                                if (!this.config.isEditProject) {
                                    // console.log(`Skip Project because of Cannot Allow to edit ${project.jobName}`)
                                    status.skippedRecord++;
                                    continue;
                                }
                            }
                            kpaProject.name = project.name;
                            kpaProject.code = project.project_number;
                            if (!kpaProject.code || kpaProject.code === '') {
                                kpaProject.code = project.name;
                            }
                            kpaProject.isActive = project.active;
                            kpaProject.address = project.address;
                            kpaProject.city = project.city;
                            kpaProject.state = project.state_code;
                            kpaProject.zip = project.zip;
                            kpaProjects.push(kpaProject);
                            status.upsertRecord++;
                        }
                        //Send Data
                        // console.log(kpaProjects)
                        const success = await kpaProjectAPI.saveProject(this.config.kpaSite, kpaProjects);
                        if (!success) {
                            console.log('Failed to save Project');
                        }
                    }
                }
            }
        }
        catch (e) {
            console.log('Worker Stop with Error : ' + String(e));
            //Send an email to failed;
        }
    }
}
exports.ProcoreProjectJob = ProcoreProjectJob;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY29yZS1wcm9qZWN0LWpvYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2NvcmUtaW50ZWdyYXRpb24vZnVuY3Rpb24vam9iL3Byb2NvcmUtcHJvamVjdC1qb2IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsK0RBQXNFO0FBQ3RFLGdDQUFvQztBQUNwQyxvQ0FBd0U7QUFDeEUsd0NBQXVEO0FBQ3ZELDJEQUFrRTtBQUdsRSxNQUFhLGlCQUFpQjtJQUkxQixZQUFZLE1BQW9DO1FBQzVDLElBQUksQ0FBQyxJQUFJLEdBQUcscUJBQXFCLENBQUM7UUFDbEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDekIsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBaUI7UUFDM0IsSUFBSSxDQUFDO1lBQ0Qsb0JBQW9CO1lBQ3BCLElBQUksYUFBYSxHQUFHLElBQUksbUJBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzVELDhEQUE4RDtZQUM5RCxJQUFJLGdCQUFnQixHQUF1QixFQUFFLENBQUM7WUFDOUMsTUFBTSxDQUFDLG1CQUFtQixHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQTtZQUVwRCxJQUFJLElBQUksR0FBRyxJQUFJLHNCQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQ3pGLElBQUksVUFBVSxHQUFHLElBQUksZ0JBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFO2dCQUNwRCxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO2dCQUMvQyxJQUFJLENBQUMsTUFBTSxDQUFDLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7Z0JBRXZELElBQUksRUFBRSxHQUFHLElBQUks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QyxDQUFDOzRCQUM3QixNQUFNLENBQUMsWUFBWSxFQUFFLENBQUE7d0JBQ3pCLENBQUM7d0JBRUQsV0FBVzt3QkFDWCwyQkFBMkI7d0JBQzNCLE1BQU0sT0FBTyxHQUFHLE1BQU0sYUFBYSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQTt3QkFDakYsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDOzRCQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQTt3QkFDekMsQ0FBQztvQkFDTCxDQUFDO2dCQUNMLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztRQUFDLE9BQU0sQ0FBQyxFQUFFLENBQUM7WUFDUixPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixHQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ2xELDBCQUEwQjtRQUM5QixDQUFDO0lBQ0wsQ0FBQztDQUVKO0FBNUZELDhDQTRGQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElKb2IgfSBmcm9tIFwiLi4vLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvam9iXCI7XG5pbXBvcnQgeyBLUEFQcm9qZWN0TW9kZWwgfSBmcm9tIFwiLi4vLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvbW9kZWxcIjtcbmltcG9ydCB7IFByb2NvcmVBUEkgfSBmcm9tIFwiLi4vYXBpXCI7XG5pbXBvcnQgeyBLUEFQcm9jb3JlQ29uZmlndXJhdGlvbk1vZGVsLCBwcm9jb3JlQ29udGV4dCB9IGZyb20gXCIuLi9tb2RlbFwiO1xuaW1wb3J0IHsgS1BBUHJvY29yZUNvbmZpZ3VyYXRpb25EQiB9IGZyb20gXCIuLi9tb25nb2RiXCI7XG5pbXBvcnQgeyBLUEFQcm9qZWN0QVBJIH0gZnJvbSBcIi4uLy4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL2FwaVwiO1xuaW1wb3J0IHsgSm9iU3RhdHVzIH0gZnJvbSBcIi4uLy4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL2pvYlwiO1xuXG5leHBvcnQgY2xhc3MgUHJvY29yZVByb2plY3RKb2IgaW1wbGVtZW50cyBJSm9iICB7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGNvbmZpZzogS1BBUHJvY29yZUNvbmZpZ3VyYXRpb25Nb2RlbDtcblxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogS1BBUHJvY29yZUNvbmZpZ3VyYXRpb25Nb2RlbCkge1xuICAgICAgICB0aGlzLm5hbWUgPSBcIlByb2NvcmUgUHJvamVjdCBKb2JcIjtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgfVxuXG4gICAgYXN5bmMgZXhlY3V0ZShzdGF0dXM6IEpvYlN0YXR1cyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy9GZXRjaCBLUEEgUHJvamVjdHNcbiAgICAgICAgICAgIGxldCBrcGFQcm9qZWN0QVBJID0gbmV3IEtQQVByb2plY3RBUEkodGhpcy5jb25maWcua3BhVG9rZW4pO1xuICAgICAgICAgICAgLy8gbGV0IGtwYUV4aXN0UHJvamVjdHMgPSBhd2FpdCBrcGFQcm9qZWN0QVBJLmdldEFsbFByb2plY3QoKTtcbiAgICAgICAgICAgIGxldCBrcGFFeGlzdFByb2plY3RzIDogS1BBUHJvamVjdE1vZGVsW10gPSBbXTtcbiAgICAgICAgICAgIHN0YXR1cy50b3RhbEV4aXN0aW5nUmVjb3JkID0ga3BhRXhpc3RQcm9qZWN0cy5sZW5ndGhcblxuICAgICAgICAgICAgbGV0IGF1dGggPSBuZXcgcHJvY29yZUNvbnRleHQodGhpcy5jb25maWcucHJvY29yZVRva2VuLCB0aGlzLmNvbmZpZy5wcm9jb3JlUmVmcmVzaFRva2VuKTtcbiAgICAgICAgICAgIGxldCBwcm9jb3JlQVBJID0gbmV3IFByb2NvcmVBUEkoYXV0aCwgYXN5bmMgKG5ld0F1dGgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZy5wcm9jb3JlVG9rZW4gPSBuZXdBdXRoLmFjY2Vzc1Rva2VuO1xuICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLnByb2NvcmVSZWZyZXNoVG9rZW4gPSBuZXdBdXRoLnJlZnJlc2hUb2tlbjtcblxuICAgICAgICAgICAgICAgIGxldCBkYiA9IG5ldyBLUEFQcm9jb3JlQ29uZmlndXJhdGlvbkRCKCk7XG4gICAgICAgICAgICAgICAgYXdhaXQgZGIudXBkYXRlUHJvY29yZVRva2VuKHRoaXMuY29uZmlnKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBsZXQgY29tcGFuaWVzID0gYXdhaXQgcHJvY29yZUFQSS5nZXRDb21wYW5pZXMoKTtcbiAgICAgICAgICAgIHN0YXR1cy50b3RhbFNvdXJjZVJlY29yZCA9IDBcbiAgICAgICAgICAgIGZvcihsZXQgY29tcGFueSBvZiBjb21wYW5pZXMpIHtcbiAgICAgICAgICAgICAgICBmb3IobGV0IHByb2NvcmVDb21wYW55SWQgb2YgdGhpcy5jb25maWcucHJvY29yZUNvbXBhbnlJZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb2NvcmVDb21wYW55SWQgPT09IGNvbXBhbnkuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwcm9qZWN0cyA9IGF3YWl0IHByb2NvcmVBUEkuZ2V0UHJvamVjdHMoY29tcGFueS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXMudG90YWxTb3VyY2VSZWNvcmQgKz0gcHJvamVjdHMubGVuZ3RoXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBrcGFQcm9qZWN0czogS1BBUHJvamVjdE1vZGVsW10gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgcHJvamVjdCBvZiBwcm9qZWN0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vSWdub3JlIFByb2plY3Qgd2l0aG91dCBqb2IgbnVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb2plY3QucHJvamVjdF9udW1iZXIgPT09IG51bGwgfHwgcHJvamVjdC5wcm9qZWN0X251bWJlciA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzLnNraXBwZWRSZWNvcmQrK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQnVpbGQgS1BBIHByb2plY3QgRGF0YSBhbmQgQ2hlY2sgZXhpc3RpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIga3BhUHJvamVjdCA6IEtQQVByb2plY3RNb2RlbCB8IG51bGwgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga3BhRXhpc3RQcm9qZWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrcGFFeGlzdFByb2plY3QgPSBrcGFFeGlzdFByb2plY3RzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoa3BhRXhpc3RQcm9qZWN0Lm5hbWUgPT09IHByb2plY3QubmFtZSAmJiBrcGFFeGlzdFByb2plY3QuY29kZSA9PT0gcHJvamVjdC5wcm9qZWN0X251bWJlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga3BhUHJvamVjdCA9IGtwYUV4aXN0UHJvamVjdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtwYUV4aXN0UHJvamVjdHMuc3BsaWNlKGksMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrcGFQcm9qZWN0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga3BhUHJvamVjdCA9IG5ldyBLUEFQcm9qZWN0TW9kZWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY29uZmlnLmlzRWRpdFByb2plY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGBTa2lwIFByb2plY3QgYmVjYXVzZSBvZiBDYW5ub3QgQWxsb3cgdG8gZWRpdCAke3Byb2plY3Quam9iTmFtZX1gKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzLnNraXBwZWRSZWNvcmQrK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrcGFQcm9qZWN0Lm5hbWUgPSBwcm9qZWN0Lm5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga3BhUHJvamVjdC5jb2RlID0gcHJvamVjdC5wcm9qZWN0X251bWJlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWtwYVByb2plY3QuY29kZSB8fCBrcGFQcm9qZWN0LmNvZGUgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtwYVByb2plY3QuY29kZSA9IHByb2plY3QubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga3BhUHJvamVjdC5pc0FjdGl2ZSA9IHByb2plY3QuYWN0aXZlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga3BhUHJvamVjdC5hZGRyZXNzID0gcHJvamVjdC5hZGRyZXNzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtwYVByb2plY3QuY2l0eSA9IHByb2plY3QuY2l0eTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrcGFQcm9qZWN0LnN0YXRlID0gcHJvamVjdC5zdGF0ZV9jb2RlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtwYVByb2plY3QuemlwID0gcHJvamVjdC56aXA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrcGFQcm9qZWN0cy5wdXNoKGtwYVByb2plY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cy51cHNlcnRSZWNvcmQrK1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL1NlbmQgRGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coa3BhUHJvamVjdHMpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzdWNjZXNzID0gYXdhaXQga3BhUHJvamVjdEFQSS5zYXZlUHJvamVjdCh0aGlzLmNvbmZpZy5rcGFTaXRlLCBrcGFQcm9qZWN0cylcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gc2F2ZSBQcm9qZWN0JylcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnV29ya2VyIFN0b3Agd2l0aCBFcnJvciA6ICcrU3RyaW5nKGUpKVxuICAgICAgICAgICAgLy9TZW5kIGFuIGVtYWlsIHRvIGZhaWxlZDtcbiAgICAgICAgfVxuICAgIH1cblxufVxuIl19