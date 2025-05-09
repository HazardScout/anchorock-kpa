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
                        if (kpaProject == null) {
                            if (!project.active) {
                                status.skippedRecord++;
                                continue;
                            }
                            kpaProject = new model_1.KPAProjectModel();
                        }
                        else {
                            if (!project.active) {
                                // update existing project as inactive
                            }
                            else if (!this.config.isEditProject) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY29yZS1wcm9qZWN0LWpvYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2NvcmUtaW50ZWdyYXRpb24vZnVuY3Rpb24vam9iL3Byb2NvcmUtcHJvamVjdC1qb2IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsK0RBQXNFO0FBQ3RFLGdDQUFvQztBQUNwQyxvQ0FBd0U7QUFDeEUsd0NBQXVEO0FBQ3ZELDJEQUFrRTtBQUdsRSxNQUFhLGlCQUFpQjtJQUkxQixZQUFZLE1BQW9DO1FBQzVDLElBQUksQ0FBQyxJQUFJLEdBQUcsd0JBQXdCLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUN0RCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN6QixDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFpQjtRQUMzQixvQkFBb0I7UUFDcEIsSUFBSSxhQUFhLEdBQUcsSUFBSSxtQkFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUQsSUFBSSxnQkFBZ0IsR0FBRyxNQUFNLGFBQWEsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUMzRCxpREFBaUQ7UUFDakQsTUFBTSxDQUFDLG1CQUFtQixHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQTtRQUVwRCxJQUFJLElBQUksR0FBRyxJQUFJLHNCQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3pGLElBQUksVUFBVSxHQUFHLElBQUksZ0JBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFO1lBQ3BELElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7WUFDL0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDO1lBRXZELElBQUksRUFBRSxHQUFHLElBQUksbUNBQXlCLEVBQUUsQ0FBQztZQUN6QyxNQUFNLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFDLENBQUE7UUFDRixJQUFJLFNBQVMsR0FBRyxNQUFNLFVBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNoRCxNQUFNLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFBO1FBQzVCLEtBQUksSUFBSSxPQUFPLElBQUksU0FBUyxFQUFFLENBQUM7WUFDM0IsS0FBSSxJQUFJLGdCQUFnQixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztnQkFDeEQsSUFBSSxnQkFBZ0IsS0FBSyxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUM7b0JBQ2xDLElBQUksUUFBUSxHQUFHLE1BQU0sVUFBVSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ3hELE1BQU0sQ0FBQyxpQkFBaUIsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFBO29CQUUzQyxJQUFJLFdBQVcsR0FBc0IsRUFBRSxDQUFDO29CQUN4QyxLQUFJLElBQUksT0FBTyxJQUFJLFFBQVEsRUFBRSxDQUFDO3dCQUMxQiwyQ0FBMkM7d0JBQzNDLElBQUksVUFBVSxHQUE0QixJQUFJLENBQUM7d0JBQy9DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQzs0QkFDL0MsTUFBTSxlQUFlLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQzVDLElBQUksZUFBZSxDQUFDLE1BQU0sSUFBSSxlQUFlLENBQUMsTUFBTSxLQUFLLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQ0FDOUUsVUFBVSxHQUFHLGVBQWUsQ0FBQztnQ0FDN0IsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztnQ0FDN0IsTUFBTTs0QkFDVixDQUFDO3dCQUNMLENBQUM7d0JBRUQsSUFBSSxVQUFVLElBQUksSUFBSSxFQUFFLENBQUM7NEJBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7Z0NBQ2xCLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQ0FDdkIsU0FBUzs0QkFDYixDQUFDOzRCQUNELFVBQVUsR0FBRyxJQUFJLHVCQUFlLEVBQUUsQ0FBQzt3QkFDdkMsQ0FBQzs2QkFBTSxDQUFDOzRCQUNKLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7Z0NBQ2xCLHNDQUFzQzs0QkFDMUMsQ0FBQztpQ0FDSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQ0FDbEMsaUZBQWlGO2dDQUNqRixNQUFNLENBQUMsYUFBYSxFQUFFLENBQUE7Z0NBQ3RCLFNBQVM7NEJBQ2IsQ0FBQzt3QkFDTCxDQUFDO3dCQUVELFVBQVUsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQzt3QkFDL0IsVUFBVSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDO3dCQUN6QyxVQUFVLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUE7d0JBQ3BDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQzt3QkFDckMsVUFBVSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO3dCQUMvQixVQUFVLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7d0JBQ3RDLFVBQVUsQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQzt3QkFFN0IsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQzt3QkFDN0IsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFBO29CQUN6QixDQUFDO29CQUVELFdBQVc7b0JBQ1gsTUFBTSxPQUFPLEdBQUcsTUFBTSxhQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFBO29CQUNqRixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBQ1gsTUFBTSxJQUFJLEtBQUssQ0FBQywwQkFBMEIsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUN0RSxDQUFDO2dCQUNMLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7Q0FFSjtBQXBGRCw4Q0FvRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJSm9iIH0gZnJvbSBcIi4uLy4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL2pvYlwiO1xuaW1wb3J0IHsgS1BBUHJvamVjdE1vZGVsIH0gZnJvbSBcIi4uLy4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL21vZGVsXCI7XG5pbXBvcnQgeyBQcm9jb3JlQVBJIH0gZnJvbSBcIi4uL2FwaVwiO1xuaW1wb3J0IHsgS1BBUHJvY29yZUNvbmZpZ3VyYXRpb25Nb2RlbCwgcHJvY29yZUNvbnRleHQgfSBmcm9tIFwiLi4vbW9kZWxcIjtcbmltcG9ydCB7IEtQQVByb2NvcmVDb25maWd1cmF0aW9uREIgfSBmcm9tIFwiLi4vbW9uZ29kYlwiO1xuaW1wb3J0IHsgS1BBUHJvamVjdEFQSSB9IGZyb20gXCIuLi8uLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy9hcGlcIjtcbmltcG9ydCB7IEpvYlN0YXR1cyB9IGZyb20gXCIuLi8uLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy9qb2JcIjtcblxuZXhwb3J0IGNsYXNzIFByb2NvcmVQcm9qZWN0Sm9iIGltcGxlbWVudHMgSUpvYiAge1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBjb25maWc6IEtQQVByb2NvcmVDb25maWd1cmF0aW9uTW9kZWw7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb25maWc6IEtQQVByb2NvcmVDb25maWd1cmF0aW9uTW9kZWwpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gXCJQcm9jb3JlIFByb2plY3QgSm9iIC0gXCIgKyBjb25maWcua3BhU2l0ZTtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgfVxuXG4gICAgYXN5bmMgZXhlY3V0ZShzdGF0dXM6IEpvYlN0YXR1cyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICAvL0ZldGNoIEtQQSBQcm9qZWN0c1xuICAgICAgICBsZXQga3BhUHJvamVjdEFQSSA9IG5ldyBLUEFQcm9qZWN0QVBJKHRoaXMuY29uZmlnLmtwYVRva2VuKTtcbiAgICAgICAgbGV0IGtwYUV4aXN0UHJvamVjdHMgPSBhd2FpdCBrcGFQcm9qZWN0QVBJLmdldEFsbFByb2plY3QoKTtcbiAgICAgICAgLy8gbGV0IGtwYUV4aXN0UHJvamVjdHMgOiBLUEFQcm9qZWN0TW9kZWxbXSA9IFtdO1xuICAgICAgICBzdGF0dXMudG90YWxFeGlzdGluZ1JlY29yZCA9IGtwYUV4aXN0UHJvamVjdHMubGVuZ3RoXG5cbiAgICAgICAgbGV0IGF1dGggPSBuZXcgcHJvY29yZUNvbnRleHQodGhpcy5jb25maWcucHJvY29yZVRva2VuLCB0aGlzLmNvbmZpZy5wcm9jb3JlUmVmcmVzaFRva2VuKTtcbiAgICAgICAgbGV0IHByb2NvcmVBUEkgPSBuZXcgUHJvY29yZUFQSShhdXRoLCBhc3luYyAobmV3QXV0aCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jb25maWcucHJvY29yZVRva2VuID0gbmV3QXV0aC5hY2Nlc3NUb2tlbjtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLnByb2NvcmVSZWZyZXNoVG9rZW4gPSBuZXdBdXRoLnJlZnJlc2hUb2tlbjtcblxuICAgICAgICAgICAgbGV0IGRiID0gbmV3IEtQQVByb2NvcmVDb25maWd1cmF0aW9uREIoKTtcbiAgICAgICAgICAgIGF3YWl0IGRiLnVwZGF0ZVByb2NvcmVUb2tlbih0aGlzLmNvbmZpZyk7XG4gICAgICAgIH0pXG4gICAgICAgIGxldCBjb21wYW5pZXMgPSBhd2FpdCBwcm9jb3JlQVBJLmdldENvbXBhbmllcygpO1xuICAgICAgICBzdGF0dXMudG90YWxTb3VyY2VSZWNvcmQgPSAwXG4gICAgICAgIGZvcihsZXQgY29tcGFueSBvZiBjb21wYW5pZXMpIHtcbiAgICAgICAgICAgIGZvcihsZXQgcHJvY29yZUNvbXBhbnlJZCBvZiB0aGlzLmNvbmZpZy5wcm9jb3JlQ29tcGFueUlkcykge1xuICAgICAgICAgICAgICAgIGlmIChwcm9jb3JlQ29tcGFueUlkID09PSBjb21wYW55LmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwcm9qZWN0cyA9IGF3YWl0IHByb2NvcmVBUEkuZ2V0UHJvamVjdHMoY29tcGFueS5pZCk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy50b3RhbFNvdXJjZVJlY29yZCArPSBwcm9qZWN0cy5sZW5ndGhcblxuICAgICAgICAgICAgICAgICAgICBsZXQga3BhUHJvamVjdHM6IEtQQVByb2plY3RNb2RlbFtdID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgcHJvamVjdCBvZiBwcm9qZWN0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9CdWlsZCBLUEEgcHJvamVjdCBEYXRhIGFuZCBDaGVjayBleGlzdGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGtwYVByb2plY3QgOiBLUEFQcm9qZWN0TW9kZWwgfCBudWxsID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga3BhRXhpc3RQcm9qZWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGtwYUV4aXN0UHJvamVjdCA9IGtwYUV4aXN0UHJvamVjdHNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtwYUV4aXN0UHJvamVjdC5udW1iZXIgJiYga3BhRXhpc3RQcm9qZWN0Lm51bWJlciA9PT0gcHJvamVjdC5wcm9qZWN0X251bWJlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrcGFQcm9qZWN0ID0ga3BhRXhpc3RQcm9qZWN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrcGFFeGlzdFByb2plY3RzLnNwbGljZShpLDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrcGFQcm9qZWN0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXByb2plY3QuYWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cy5za2lwcGVkUmVjb3JkKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrcGFQcm9qZWN0ID0gbmV3IEtQQVByb2plY3RNb2RlbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXByb2plY3QuYWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBleGlzdGluZyBwcm9qZWN0IGFzIGluYWN0aXZlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCF0aGlzLmNvbmZpZy5pc0VkaXRQcm9qZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGBTa2lwIFByb2plY3QgYmVjYXVzZSBvZiBDYW5ub3QgQWxsb3cgdG8gZWRpdCAke3Byb2plY3Quam9iTmFtZX1gKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXMuc2tpcHBlZFJlY29yZCsrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAga3BhUHJvamVjdC5uYW1lID0gcHJvamVjdC5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAga3BhUHJvamVjdC5jb2RlID0gcHJvamVjdC5wcm9qZWN0X251bWJlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtwYVByb2plY3QuaXNBY3RpdmUgPSBwcm9qZWN0LmFjdGl2ZVxuICAgICAgICAgICAgICAgICAgICAgICAga3BhUHJvamVjdC5hZGRyZXNzID0gcHJvamVjdC5hZGRyZXNzO1xuICAgICAgICAgICAgICAgICAgICAgICAga3BhUHJvamVjdC5jaXR5ID0gcHJvamVjdC5jaXR5O1xuICAgICAgICAgICAgICAgICAgICAgICAga3BhUHJvamVjdC5zdGF0ZSA9IHByb2plY3Quc3RhdGVfY29kZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtwYVByb2plY3QuemlwID0gcHJvamVjdC56aXA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGtwYVByb2plY3RzLnB1c2goa3BhUHJvamVjdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXMudXBzZXJ0UmVjb3JkKytcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vU2VuZCBEYXRhXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN1Y2Nlc3MgPSBhd2FpdCBrcGFQcm9qZWN0QVBJLnNhdmVQcm9qZWN0KHRoaXMuY29uZmlnLmtwYVNpdGUsIGtwYVByb2plY3RzKVxuICAgICAgICAgICAgICAgICAgICBpZiAoIXN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIHNhdmUgUHJvamVjdHM6JyArIHRoaXMuY29uZmlnLmtwYVNpdGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG59XG4iXX0=