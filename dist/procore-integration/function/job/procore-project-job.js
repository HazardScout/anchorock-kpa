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
                        //Build KPA project Data and Check existing
                        var kpaProject = null;
                        for (let i = 0; i < kpaExistProjects.length; i++) {
                            const kpaExistProject = kpaExistProjects[i];
                            if (kpaExistProject.code === project.project_number) {
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
}
exports.ProcoreProjectJob = ProcoreProjectJob;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY29yZS1wcm9qZWN0LWpvYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2NvcmUtaW50ZWdyYXRpb24vZnVuY3Rpb24vam9iL3Byb2NvcmUtcHJvamVjdC1qb2IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsK0RBQXNFO0FBQ3RFLGdDQUFvQztBQUNwQyxvQ0FBd0U7QUFDeEUsd0NBQXVEO0FBQ3ZELDJEQUFrRTtBQUdsRSxNQUFhLGlCQUFpQjtJQUkxQixZQUFZLE1BQW9DO1FBQzVDLElBQUksQ0FBQyxJQUFJLEdBQUcscUJBQXFCLENBQUM7UUFDbEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDekIsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBaUI7UUFDM0Isb0JBQW9CO1FBQ3BCLElBQUksYUFBYSxHQUFHLElBQUksbUJBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVELDhEQUE4RDtRQUM5RCxJQUFJLGdCQUFnQixHQUF1QixFQUFFLENBQUM7UUFDOUMsTUFBTSxDQUFDLG1CQUFtQixHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQTtRQUVwRCxJQUFJLElBQUksR0FBRyxJQUFJLHNCQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3pGLElBQUksVUFBVSxHQUFHLElBQUksZ0JBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFO1lBQ3BELElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7WUFDL0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDO1lBRXZELElBQUksRUFBRSxHQUFHLElBQUksbUNBQXlCLEVBQUUsQ0FBQztZ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cG9ydCB7IElKb2IgfSBmcm9tIFwiLi4vLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvam9iXCI7XG5pbXBvcnQgeyBLUEFQcm9qZWN0TW9kZWwgfSBmcm9tIFwiLi4vLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvbW9kZWxcIjtcbmltcG9ydCB7IFByb2NvcmVBUEkgfSBmcm9tIFwiLi4vYXBpXCI7XG5pbXBvcnQgeyBLUEFQcm9jb3JlQ29uZmlndXJhdGlvbk1vZGVsLCBwcm9jb3JlQ29udGV4dCB9IGZyb20gXCIuLi9tb2RlbFwiO1xuaW1wb3J0IHsgS1BBUHJvY29yZUNvbmZpZ3VyYXRpb25EQiB9IGZyb20gXCIuLi9tb25nb2RiXCI7XG5pbXBvcnQgeyBLUEFQcm9qZWN0QVBJIH0gZnJvbSBcIi4uLy4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL2FwaVwiO1xuaW1wb3J0IHsgSm9iU3RhdHVzIH0gZnJvbSBcIi4uLy4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL2pvYlwiO1xuXG5leHBvcnQgY2xhc3MgUHJvY29yZVByb2plY3RKb2IgaW1wbGVtZW50cyBJSm9iICB7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGNvbmZpZzogS1BBUHJvY29yZUNvbmZpZ3VyYXRpb25Nb2RlbDtcblxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogS1BBUHJvY29yZUNvbmZpZ3VyYXRpb25Nb2RlbCkge1xuICAgICAgICB0aGlzLm5hbWUgPSBcIlByb2NvcmUgUHJvamVjdCBKb2JcIjtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgfVxuXG4gICAgYXN5bmMgZXhlY3V0ZShzdGF0dXM6IEpvYlN0YXR1cyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICAvL0ZldGNoIEtQQSBQcm9qZWN0c1xuICAgICAgICBsZXQga3BhUHJvamVjdEFQSSA9IG5ldyBLUEFQcm9qZWN0QVBJKHRoaXMuY29uZmlnLmtwYVRva2VuKTtcbiAgICAgICAgLy8gbGV0IGtwYUV4aXN0UHJvamVjdHMgPSBhd2FpdCBrcGFQcm9qZWN0QVBJLmdldEFsbFByb2plY3QoKTtcbiAgICAgICAgbGV0IGtwYUV4aXN0UHJvamVjdHMgOiBLUEFQcm9qZWN0TW9kZWxbXSA9IFtdO1xuICAgICAgICBzdGF0dXMudG90YWxFeGlzdGluZ1JlY29yZCA9IGtwYUV4aXN0UHJvamVjdHMubGVuZ3RoXG5cbiAgICAgICAgbGV0IGF1dGggPSBuZXcgcHJvY29yZUNvbnRleHQodGhpcy5jb25maWcucHJvY29yZVRva2VuLCB0aGlzLmNvbmZpZy5wcm9jb3JlUmVmcmVzaFRva2VuKTtcbiAgICAgICAgbGV0IHByb2NvcmVBUEkgPSBuZXcgUHJvY29yZUFQSShhdXRoLCBhc3luYyAobmV3QXV0aCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jb25maWcucHJvY29yZVRva2VuID0gbmV3QXV0aC5hY2Nlc3NUb2tlbjtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLnByb2NvcmVSZWZyZXNoVG9rZW4gPSBuZXdBdXRoLnJlZnJlc2hUb2tlbjtcblxuICAgICAgICAgICAgbGV0IGRiID0gbmV3IEtQQVByb2NvcmVDb25maWd1cmF0aW9uREIoKTtcbiAgICAgICAgICAgIGF3YWl0IGRiLnVwZGF0ZVByb2NvcmVUb2tlbih0aGlzLmNvbmZpZyk7XG4gICAgICAgIH0pXG4gICAgICAgIGxldCBjb21wYW5pZXMgPSBhd2FpdCBwcm9jb3JlQVBJLmdldENvbXBhbmllcygpO1xuICAgICAgICBzdGF0dXMudG90YWxTb3VyY2VSZWNvcmQgPSAwXG4gICAgICAgIGZvcihsZXQgY29tcGFueSBvZiBjb21wYW5pZXMpIHtcbiAgICAgICAgICAgIGZvcihsZXQgcHJvY29yZUNvbXBhbnlJZCBvZiB0aGlzLmNvbmZpZy5wcm9jb3JlQ29tcGFueUlkcykge1xuICAgICAgICAgICAgICAgIGlmIChwcm9jb3JlQ29tcGFueUlkID09PSBjb21wYW55LmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwcm9qZWN0cyA9IGF3YWl0IHByb2NvcmVBUEkuZ2V0UHJvamVjdHMoY29tcGFueS5pZCk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy50b3RhbFNvdXJjZVJlY29yZCArPSBwcm9qZWN0cy5sZW5ndGhcblxuICAgICAgICAgICAgICAgICAgICBsZXQga3BhUHJvamVjdHM6IEtQQVByb2plY3RNb2RlbFtdID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgcHJvamVjdCBvZiBwcm9qZWN0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9CdWlsZCBLUEEgcHJvamVjdCBEYXRhIGFuZCBDaGVjayBleGlzdGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGtwYVByb2plY3QgOiBLUEFQcm9qZWN0TW9kZWwgfCBudWxsID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga3BhRXhpc3RQcm9qZWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGtwYUV4aXN0UHJvamVjdCA9IGtwYUV4aXN0UHJvamVjdHNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtwYUV4aXN0UHJvamVjdC5jb2RlID09PSBwcm9qZWN0LnByb2plY3RfbnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtwYVByb2plY3QgPSBrcGFFeGlzdFByb2plY3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtwYUV4aXN0UHJvamVjdHMuc3BsaWNlKGksMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtwYVByb2plY3QgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtwYVByb2plY3QgPSBuZXcgS1BBUHJvamVjdE1vZGVsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5jb25maWcuaXNFZGl0UHJvamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgU2tpcCBQcm9qZWN0IGJlY2F1c2Ugb2YgQ2Fubm90IEFsbG93IHRvIGVkaXQgJHtwcm9qZWN0LmpvYk5hbWV9YClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzLnNraXBwZWRSZWNvcmQrK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGtwYVByb2plY3QubmFtZSA9IHByb2plY3QubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtwYVByb2plY3QuY29kZSA9IHByb2plY3QucHJvamVjdF9udW1iZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBrcGFQcm9qZWN0LmlzQWN0aXZlID0gcHJvamVjdC5hY3RpdmVcbiAgICAgICAgICAgICAgICAgICAgICAgIGtwYVByb2plY3QuYWRkcmVzcyA9IHByb2plY3QuYWRkcmVzcztcbiAgICAgICAgICAgICAgICAgICAgICAgIGtwYVByb2plY3QuY2l0eSA9IHByb2plY3QuY2l0eTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtwYVByb2plY3Quc3RhdGUgPSBwcm9qZWN0LnN0YXRlX2NvZGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBrcGFQcm9qZWN0LnppcCA9IHByb2plY3QuemlwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBrcGFQcm9qZWN0cy5wdXNoKGtwYVByb2plY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzLnVwc2VydFJlY29yZCsrXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvL1NlbmQgRGF0YVxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhrcGFQcm9qZWN0cylcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3VjY2VzcyA9IGF3YWl0IGtwYVByb2plY3RBUEkuc2F2ZVByb2plY3QodGhpcy5jb25maWcua3BhU2l0ZSwga3BhUHJvamVjdHMpXG4gICAgICAgICAgICAgICAgICAgIGlmICghc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBzYXZlIFByb2plY3QnKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG59XG4iXX0=