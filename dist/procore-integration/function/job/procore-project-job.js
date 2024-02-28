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
                for (let procoreCompany of this.config.procoreCompanies) {
                    if (procoreCompany === company.name) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY29yZS1wcm9qZWN0LWpvYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2NvcmUtaW50ZWdyYXRpb24vZnVuY3Rpb24vam9iL3Byb2NvcmUtcHJvamVjdC1qb2IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsK0RBQXNFO0FBQ3RFLGdDQUFvQztBQUNwQyxvQ0FBd0U7QUFDeEUsd0NBQXVEO0FBQ3ZELDJEQUFrRTtBQUdsRSxNQUFhLGlCQUFpQjtJQUkxQixZQUFZLE1BQW9DO1FBQzVDLElBQUksQ0FBQyxJQUFJLEdBQUcscUJBQXFCLENBQUM7UUFDbEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDekIsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBaUI7UUFDM0IsSUFBSSxDQUFDO1lBQ0Qsb0JBQW9CO1lBQ3BCLElBQUksYUFBYSxHQUFHLElBQUksbUJBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzVELDhEQUE4RDtZQUM5RCxJQUFJLGdCQUFnQixHQUF1QixFQUFFLENBQUM7WUFDOUMsTUFBTSxDQUFDLG1CQUFtQixHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQTtZQUVwRCxJQUFJLElBQUksR0FBRyxJQUFJLHNCQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQ3pGLElBQUksVUFBVSxHQUFHLElBQUksZ0JBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFO2dCQUNwRCxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO2dCQUMvQyxJQUFJLENBQUMsTUFBTSxDQUFDLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7Z0JBRXZELElBQUksRUFBRSxHQUFHLElBQUks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QUM7NEJBQzdCLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQTt3QkFDekIsQ0FBQzt3QkFFRCxXQUFXO3dCQUNYLDJCQUEyQjt3QkFDM0IsTUFBTSxPQUFPLEdBQUcsTUFBTSxhQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFBO3dCQUNqRixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7NEJBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBO3dCQUN6QyxDQUFDO29CQUNMLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBQUMsT0FBTSxDQUFDLEVBQUUsQ0FBQztZQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLEdBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDbEQsMEJBQTBCO1FBQzlCLENBQUM7SUFDTCxDQUFDO0NBRUo7QUE1RkQsOENBNEZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUpvYiB9IGZyb20gXCIuLi8uLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy9qb2JcIjtcbmltcG9ydCB7IEtQQVByb2plY3RNb2RlbCB9IGZyb20gXCIuLi8uLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy9tb2RlbFwiO1xuaW1wb3J0IHsgUHJvY29yZUFQSSB9IGZyb20gXCIuLi9hcGlcIjtcbmltcG9ydCB7IEtQQVByb2NvcmVDb25maWd1cmF0aW9uTW9kZWwsIHByb2NvcmVDb250ZXh0IH0gZnJvbSBcIi4uL21vZGVsXCI7XG5pbXBvcnQgeyBLUEFQcm9jb3JlQ29uZmlndXJhdGlvbkRCIH0gZnJvbSBcIi4uL21vbmdvZGJcIjtcbmltcG9ydCB7IEtQQVByb2plY3RBUEkgfSBmcm9tIFwiLi4vLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvYXBpXCI7XG5pbXBvcnQgeyBKb2JTdGF0dXMgfSBmcm9tIFwiLi4vLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvam9iXCI7XG5cbmV4cG9ydCBjbGFzcyBQcm9jb3JlUHJvamVjdEpvYiBpbXBsZW1lbnRzIElKb2IgIHtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgY29uZmlnOiBLUEFQcm9jb3JlQ29uZmlndXJhdGlvbk1vZGVsO1xuXG4gICAgY29uc3RydWN0b3IoY29uZmlnOiBLUEFQcm9jb3JlQ29uZmlndXJhdGlvbk1vZGVsKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IFwiUHJvY29yZSBQcm9qZWN0IEpvYlwiO1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB9XG5cbiAgICBhc3luYyBleGVjdXRlKHN0YXR1czogSm9iU3RhdHVzKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvL0ZldGNoIEtQQSBQcm9qZWN0c1xuICAgICAgICAgICAgbGV0IGtwYVByb2plY3RBUEkgPSBuZXcgS1BBUHJvamVjdEFQSSh0aGlzLmNvbmZpZy5rcGFUb2tlbik7XG4gICAgICAgICAgICAvLyBsZXQga3BhRXhpc3RQcm9qZWN0cyA9IGF3YWl0IGtwYVByb2plY3RBUEkuZ2V0QWxsUHJvamVjdCgpO1xuICAgICAgICAgICAgbGV0IGtwYUV4aXN0UHJvamVjdHMgOiBLUEFQcm9qZWN0TW9kZWxbXSA9IFtdO1xuICAgICAgICAgICAgc3RhdHVzLnRvdGFsRXhpc3RpbmdSZWNvcmQgPSBrcGFFeGlzdFByb2plY3RzLmxlbmd0aFxuXG4gICAgICAgICAgICBsZXQgYXV0aCA9IG5ldyBwcm9jb3JlQ29udGV4dCh0aGlzLmNvbmZpZy5wcm9jb3JlVG9rZW4sIHRoaXMuY29uZmlnLnByb2NvcmVSZWZyZXNoVG9rZW4pO1xuICAgICAgICAgICAgbGV0IHByb2NvcmVBUEkgPSBuZXcgUHJvY29yZUFQSShhdXRoLCBhc3luYyAobmV3QXV0aCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY29uZmlnLnByb2NvcmVUb2tlbiA9IG5ld0F1dGguYWNjZXNzVG9rZW47XG4gICAgICAgICAgICAgICAgdGhpcy5jb25maWcucHJvY29yZVJlZnJlc2hUb2tlbiA9IG5ld0F1dGgucmVmcmVzaFRva2VuO1xuXG4gICAgICAgICAgICAgICAgbGV0IGRiID0gbmV3IEtQQVByb2NvcmVDb25maWd1cmF0aW9uREIoKTtcbiAgICAgICAgICAgICAgICBhd2FpdCBkYi51cGRhdGVQcm9jb3JlVG9rZW4odGhpcy5jb25maWcpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGxldCBjb21wYW5pZXMgPSBhd2FpdCBwcm9jb3JlQVBJLmdldENvbXBhbmllcygpO1xuICAgICAgICAgICAgc3RhdHVzLnRvdGFsU291cmNlUmVjb3JkID0gMFxuICAgICAgICAgICAgZm9yKGxldCBjb21wYW55IG9mIGNvbXBhbmllcykge1xuICAgICAgICAgICAgICAgIGZvcihsZXQgcHJvY29yZUNvbXBhbnkgb2YgdGhpcy5jb25maWcucHJvY29yZUNvbXBhbmllcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvY29yZUNvbXBhbnkgPT09IGNvbXBhbnkubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHByb2plY3RzID0gYXdhaXQgcHJvY29yZUFQSS5nZXRQcm9qZWN0cyhjb21wYW55LmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cy50b3RhbFNvdXJjZVJlY29yZCArPSBwcm9qZWN0cy5sZW5ndGhcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGtwYVByb2plY3RzOiBLUEFQcm9qZWN0TW9kZWxbXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBwcm9qZWN0IG9mIHByb2plY3RzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9JZ25vcmUgUHJvamVjdCB3aXRob3V0IGpvYiBudW1iZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvamVjdC5wcm9qZWN0X251bWJlciA9PT0gbnVsbCB8fCBwcm9qZWN0LnByb2plY3RfbnVtYmVyID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXMuc2tpcHBlZFJlY29yZCsrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9CdWlsZCBLUEEgcHJvamVjdCBEYXRhIGFuZCBDaGVjayBleGlzdGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBrcGFQcm9qZWN0IDogS1BBUHJvamVjdE1vZGVsIHwgbnVsbCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrcGFFeGlzdFByb2plY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGtwYUV4aXN0UHJvamVjdCA9IGtwYUV4aXN0UHJvamVjdHNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrcGFFeGlzdFByb2plY3QubmFtZSA9PT0gcHJvamVjdC5uYW1lICYmIGtwYUV4aXN0UHJvamVjdC5jb2RlID09PSBwcm9qZWN0LnByb2plY3RfbnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrcGFQcm9qZWN0ID0ga3BhRXhpc3RQcm9qZWN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga3BhRXhpc3RQcm9qZWN0cy5zcGxpY2UoaSwxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtwYVByb2plY3QgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrcGFQcm9qZWN0ID0gbmV3IEtQQVByb2plY3RNb2RlbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5jb25maWcuaXNFZGl0UHJvamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYFNraXAgUHJvamVjdCBiZWNhdXNlIG9mIENhbm5vdCBBbGxvdyB0byBlZGl0ICR7cHJvamVjdC5qb2JOYW1lfWApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXMuc2tpcHBlZFJlY29yZCsrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtwYVByb2plY3QubmFtZSA9IHByb2plY3QubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrcGFQcm9qZWN0LmNvZGUgPSBwcm9qZWN0LnByb2plY3RfbnVtYmVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgha3BhUHJvamVjdC5jb2RlIHx8IGtwYVByb2plY3QuY29kZSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga3BhUHJvamVjdC5jb2RlID0gcHJvamVjdC5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrcGFQcm9qZWN0LmlzQWN0aXZlID0gcHJvamVjdC5hY3RpdmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrcGFQcm9qZWN0LmFkZHJlc3MgPSBwcm9qZWN0LmFkZHJlc3M7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga3BhUHJvamVjdC5jaXR5ID0gcHJvamVjdC5jaXR5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtwYVByb2plY3Quc3RhdGUgPSBwcm9qZWN0LnN0YXRlX2NvZGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga3BhUHJvamVjdC56aXAgPSBwcm9qZWN0LnppcDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtwYVByb2plY3RzLnB1c2goa3BhUHJvamVjdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzLnVwc2VydFJlY29yZCsrXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vU2VuZCBEYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhrcGFQcm9qZWN0cylcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHN1Y2Nlc3MgPSBhd2FpdCBrcGFQcm9qZWN0QVBJLnNhdmVQcm9qZWN0KHRoaXMuY29uZmlnLmtwYVNpdGUsIGtwYVByb2plY3RzKVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBzYXZlIFByb2plY3QnKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdXb3JrZXIgU3RvcCB3aXRoIEVycm9yIDogJytTdHJpbmcoZSkpXG4gICAgICAgICAgICAvL1NlbmQgYW4gZW1haWwgdG8gZmFpbGVkO1xuICAgICAgICB9XG4gICAgfVxuXG59XG4iXX0=