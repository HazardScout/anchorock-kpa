"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcoreAPI = void 0;
const axios_1 = require("axios");
const model_1 = require("../model");
class ProcoreAPI {
    constructor(auth, resaveToken) {
        this.auth = auth;
        this.resaveToken = resaveToken;
        this.authInstance = axios_1.default.create({
            baseURL: 'https://login.procore.com/oauth/token/'
            // baseURL: 'https://login-sandbox.procore.com/oauth/token/'
        });
        this.authInstance.defaults.headers.post['Accept'] = 'application/json';
        this.authInstance.defaults.headers.post['Content-Type'] = 'application/json';
        this.apiInstance = axios_1.default.create({
            baseURL: 'https://api.procore.com/rest/v1.0/'
            // baseURL: 'https://sandbox.procore.com/rest/v1.0/'
        });
        this.apiInstance.defaults.headers.common['Authorization'] = `Bearer ${auth.accessToken}`;
        this.apiInstance.defaults.headers.post['Accept'] = 'application/json';
        this.apiInstance.defaults.headers.post['Content-Type'] = 'application/json';
    }
    async refreshToken() {
        var _a;
        try {
            const { data } = await this.authInstance.post('', { grant_type: 'refresh_token', refresh_token: this.auth.refreshToken });
            const accessToken = data['access_token'];
            const refreshToken = data['refresh_token'];
            return new model_1.procoreContext(accessToken, refreshToken);
        }
        catch (e) {
            throw new Error(JSON.stringify(((_a = e.response) === null || _a === void 0 ? void 0 : _a.data) || e));
        }
    }
    async getCompanies() {
        var _a, _b;
        const result = [];
        try {
            const { data } = await this.apiInstance
                .get('/companies');
            for (var companyData of data) {
                let company = Object.assign(new model_1.ProcoreCompanyModel(), companyData);
                result.push(company);
            }
        }
        catch (e) {
            //For some reason, Cannot acess status on error Response
            const errorResponse = JSON.parse(JSON.stringify(e));
            if (errorResponse['status'] == 401) {
                //Break Code - Temporary
                if (this.auth.refreshToken === '1') {
                    throw new Error(JSON.stringify(((_a = e.response) === null || _a === void 0 ? void 0 : _a.data) || e));
                }
                this.auth = await this.refreshToken();
                await this.resaveToken(this.auth);
                this.apiInstance.defaults.headers.common['Authorization'] = `Bearer ${this.auth.accessToken}`;
                return await this.getCompanies();
            }
            else {
                throw new Error(JSON.stringify(((_b = e.response) === null || _b === void 0 ? void 0 : _b.data) || e));
            }
        }
        return result;
    }
    async getProjects(companyId) {
        var _a, _b;
        const result = [];
        try {
            const { data } = await this.apiInstance
                .get('/projects', { params: { company_id: companyId }, headers: { 'Procore-Company-Id': `${companyId}` } });
            for (var projectData of data) {
                let project = Object.assign(new model_1.ProcoreCompanyModel(), projectData);
                result.push(project);
            }
        }
        catch (e) {
            //For some reason, Cannot acess status on error Response
            const errorResponse = JSON.parse(JSON.stringify(e));
            if (errorResponse['status'] == 401) {
                //Break Code - Temporary
                if (this.auth.refreshToken === '1') {
                    throw new Error(JSON.stringify(((_a = e.response) === null || _a === void 0 ? void 0 : _a.data) || e));
                }
                this.auth = await this.refreshToken();
                await this.resaveToken(this.auth);
                this.apiInstance.defaults.headers.common['Authorization'] = `Bearer ${this.auth.accessToken}`;
                return await this.getProjects(companyId);
            }
            else {
                throw new Error(JSON.stringify(((_b = e.response) === null || _b === void 0 ? void 0 : _b.data) || e));
            }
        }
        return result;
    }
    async getUsers(companyId) {
        var _a, _b;
        const result = [];
        try {
            const { data } = await this.apiInstance
                .get('/users', { params: { company_id: companyId }, headers: { 'Procore-Company-Id': `${companyId}` } });
            for (var userData of data) {
                let user = Object.assign(new model_1.ProcoreUserModel(), userData);
                result.push(user);
            }
        }
        catch (e) {
            //For some reason, Cannot acess status on error Response
            const errorResponse = JSON.parse(JSON.stringify(e));
            if (errorResponse['status'] == 401) {
                //Break Code - Temporary
                if (this.auth.refreshToken === '1') {
                    throw new Error(JSON.stringify(((_a = e.response) === null || _a === void 0 ? void 0 : _a.data) || e));
                }
                this.auth = await this.refreshToken();
                ;
                await this.resaveToken(this.auth);
                this.apiInstance.defaults.headers.common['Authorization'] = `Bearer ${this.auth.accessToken}`;
                return await this.getUsers(companyId);
            }
            else {
                throw new Error(JSON.stringify(((_b = e.response) === null || _b === void 0 ? void 0 : _b.data) || e));
            }
        }
        return result;
    }
}
exports.ProcoreAPI = ProcoreAPI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY29yZS1hcGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9jb3JlLWludGVncmF0aW9uL2Z1bmN0aW9uL2FwaS9wcm9jb3JlLWFwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBcUM7QUFDckMsb0NBQXNHO0FBRXRHLE1BQWEsVUFBVTtJQU1uQixZQUFZLElBQW9CLEVBQUUsV0FBb0Q7UUFDbEYsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFFL0IsSUFBSSxDQUFDLFlBQVksR0FBRyxlQUFLLENBQUMsTUFBTSxDQUFDO1lBQzdCLE9BQU8sRUFBRSx3Q0FBd0M7WUFDakQsNERBQTREO1NBQy9ELENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsa0JBQWtCLENBQUM7UUFDdkUsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxrQkFBa0IsQ0FBQztRQUU3RSxJQUFJLENBQUMsV0FBVyxHQUFHLGVBQUssQ0FBQyxNQUFNLENBQUM7WUFDNUIsT0FBTyxFQUFFLG9DQUFvQztZQUM3QyxvREFBb0Q7U0FDdkQsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsR0FBRyxVQUFVLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN6RixJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLGtCQUFrQixDQUFDO1FBQ3RFLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxD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QUssR0FBRyxFQUFFLENBQUM7b0JBQ2pDLE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBLE1BQUEsQ0FBQyxDQUFDLFFBQVEsMENBQUUsSUFBSSxLQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNELENBQUM7Z0JBRUQsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFBQSxDQUFDO2dCQUN2QyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO2dCQUVqQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxHQUFHLFVBQVUsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDOUYsT0FBTyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7WUFDekMsQ0FBQztpQkFBTSxDQUFDO2dCQUNKLE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBLE1BQUEsQ0FBQyxDQUFDLFFBQVEsMENBQUUsSUFBSSxLQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0QsQ0FBQztRQUNMLENBQUM7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0NBRUo7QUF0SUQsZ0NBc0lDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF4aW9zLCB7IEF4aW9zIH0gZnJvbSBcImF4aW9zXCI7XG5pbXBvcnQgeyBwcm9jb3JlQ29udGV4dCwgUHJvY29yZUNvbXBhbnlNb2RlbCwgUHJvY29yZVByb2plY3RNb2RlbCwgUHJvY29yZVVzZXJNb2RlbCB9IGZyb20gXCIuLi9tb2RlbFwiO1xuXG5leHBvcnQgY2xhc3MgUHJvY29yZUFQSSB7XG4gICAgYXV0aDogcHJvY29yZUNvbnRleHQ7XG4gICAgYXV0aEluc3RhbmNlOiBBeGlvcztcbiAgICBhcGlJbnN0YW5jZTogQXhpb3M7XG4gICAgcmVzYXZlVG9rZW46IChhdXRoOiBwcm9jb3JlQ29udGV4dCkgPT4gUHJvbWlzZTx2b2lkPjtcblxuICAgIGNvbnN0cnVjdG9yKGF1dGg6IHByb2NvcmVDb250ZXh0LCByZXNhdmVUb2tlbjogKGF1dGg6IHByb2NvcmVDb250ZXh0KSA9PiBQcm9taXNlPHZvaWQ+KSB7XG4gICAgICAgIHRoaXMuYXV0aCA9IGF1dGg7XG4gICAgICAgIHRoaXMucmVzYXZlVG9rZW4gPSByZXNhdmVUb2tlbjtcblxuICAgICAgICB0aGlzLmF1dGhJbnN0YW5jZSA9IGF4aW9zLmNyZWF0ZSh7XG4gICAgICAgICAgICBiYXNlVVJMOiAnaHR0cHM6Ly9sb2dpbi5wcm9jb3JlLmNvbS9vYXV0aC90b2tlbi8nXG4gICAgICAgICAgICAvLyBiYXNlVVJMOiAnaHR0cHM6Ly9sb2dpbi1zYW5kYm94LnByb2NvcmUuY29tL29hdXRoL3Rva2VuLydcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5hdXRoSW5zdGFuY2UuZGVmYXVsdHMuaGVhZGVycy5wb3N0WydBY2NlcHQnXSA9ICdhcHBsaWNhdGlvbi9qc29uJztcbiAgICAgICAgdGhpcy5hdXRoSW5zdGFuY2UuZGVmYXVsdHMuaGVhZGVycy5wb3N0WydDb250ZW50LVR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uJztcblxuICAgICAgICB0aGlzLmFwaUluc3RhbmNlID0gYXhpb3MuY3JlYXRlKHtcbiAgICAgICAgICAgIGJhc2VVUkw6ICdodHRwczovL2FwaS5wcm9jb3JlLmNvbS9yZXN0L3YxLjAvJ1xuICAgICAgICAgICAgLy8gYmFzZVVSTDogJ2h0dHBzOi8vc2FuZGJveC5wcm9jb3JlLmNvbS9yZXN0L3YxLjAvJ1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmFwaUluc3RhbmNlLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydBdXRob3JpemF0aW9uJ10gPSBgQmVhcmVyICR7YXV0aC5hY2Nlc3NUb2tlbn1gO1xuICAgICAgICB0aGlzLmFwaUluc3RhbmNlLmRlZmF1bHRzLmhlYWRlcnMucG9zdFsnQWNjZXB0J10gPSAnYXBwbGljYXRpb24vanNvbic7XG4gICAgICAgIHRoaXMuYXBpSW5zdGFuY2UuZGVmYXVsdHMuaGVhZGVycy5wb3N0WydDb250ZW50LVR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uJztcbiAgICB9XG5cbiAgICBhc3luYyByZWZyZXNoVG9rZW4oKTogUHJvbWlzZTxwcm9jb3JlQ29udGV4dD4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLmF1dGhJbnN0YW5jZS5wb3N0KCcnLCB7Z3JhbnRfdHlwZTogJ3JlZnJlc2hfdG9rZW4nLCByZWZyZXNoX3Rva2VuOiB0aGlzLmF1dGgucmVmcmVzaFRva2VufSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gZGF0YVsnYWNjZXNzX3Rva2VuJ107XG4gICAgICAgICAgICBjb25zdCByZWZyZXNoVG9rZW4gPSBkYXRhWydyZWZyZXNoX3Rva2VuJ107XG4gICAgICAgICAgICByZXR1cm4gbmV3IHByb2NvcmVDb250ZXh0KGFjY2Vzc1Rva2VuLCByZWZyZXNoVG9rZW4pO1xuICAgICAgICB9IGNhdGNoKGU6YW55KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoSlNPTi5zdHJpbmdpZnkoZS5yZXNwb25zZT8uZGF0YSB8fCBlKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBnZXRDb21wYW5pZXMoKSAgOiBQcm9taXNlPFByb2NvcmVDb21wYW55TW9kZWxbXT57XG4gICAgICAgIGNvbnN0IHJlc3VsdDogUHJvY29yZUNvbXBhbnlNb2RlbFtdID0gW107XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuYXBpSW5zdGFuY2VcbiAgICAgICAgICAgIC5nZXQoJy9jb21wYW5pZXMnKVxuICAgICAgICAgICAgZm9yICh2YXIgY29tcGFueURhdGEgb2YgZGF0YSkge1xuICAgICAgICAgICAgICAgIGxldCBjb21wYW55ID0gT2JqZWN0LmFzc2lnbihuZXcgUHJvY29yZUNvbXBhbnlNb2RlbCgpLCBjb21wYW55RGF0YSk7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goY29tcGFueSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2goZTphbnkpIHtcbiAgICAgICAgICAgIC8vRm9yIHNvbWUgcmVhc29uLCBDYW5ub3QgYWNlc3Mgc3RhdHVzIG9uIGVycm9yIFJlc3BvbnNlXG4gICAgICAgICAgICBjb25zdCBlcnJvclJlc3BvbnNlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShlKSk7XG4gICAgICAgICAgICBpZiAoZXJyb3JSZXNwb25zZVsnc3RhdHVzJ10gPT0gNDAxKSB7XG5cbiAgICAgICAgICAgICAgICAvL0JyZWFrIENvZGUgLSBUZW1wb3JhcnlcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hdXRoLnJlZnJlc2hUb2tlbiA9PT0gJzEnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihKU09OLnN0cmluZ2lmeShlLnJlc3BvbnNlPy5kYXRhIHx8IGUpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmF1dGggPSBhd2FpdCB0aGlzLnJlZnJlc2hUb2tlbigpO1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucmVzYXZlVG9rZW4odGhpcy5hdXRoKVxuXG4gICAgICAgICAgICAgICAgdGhpcy5hcGlJbnN0YW5jZS5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnQXV0aG9yaXphdGlvbiddID0gYEJlYXJlciAke3RoaXMuYXV0aC5hY2Nlc3NUb2tlbn1gO1xuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmdldENvbXBhbmllcygpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihKU09OLnN0cmluZ2lmeShlLnJlc3BvbnNlPy5kYXRhIHx8IGUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGFzeW5jIGdldFByb2plY3RzKGNvbXBhbnlJZDogbnVtYmVyKSA6IFByb21pc2U8UHJvY29yZVByb2plY3RNb2RlbFtdPiB7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0OiBQcm9jb3JlUHJvamVjdE1vZGVsW10gPSBbXTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy5hcGlJbnN0YW5jZVxuICAgICAgICAgICAgLmdldCgnL3Byb2plY3RzJywgeyBwYXJhbXM6IHsgY29tcGFueV9pZDogY29tcGFueUlkIH0gLCBoZWFkZXJzOiB7ICdQcm9jb3JlLUNvbXBhbnktSWQnOiBgJHtjb21wYW55SWR9YH19KVxuICAgICAgICAgICAgZm9yICh2YXIgcHJvamVjdERhdGEgb2YgZGF0YSkge1xuICAgICAgICAgICAgICAgIGxldCBwcm9qZWN0ID0gT2JqZWN0LmFzc2lnbihuZXcgUHJvY29yZUNvbXBhbnlNb2RlbCgpLCBwcm9qZWN0RGF0YSk7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocHJvamVjdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2goZTphbnkpIHtcbiAgICAgICAgICAgIC8vRm9yIHNvbWUgcmVhc29uLCBDYW5ub3QgYWNlc3Mgc3RhdHVzIG9uIGVycm9yIFJlc3BvbnNlXG4gICAgICAgICAgICBjb25zdCBlcnJvclJlc3BvbnNlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShlKSk7XG4gICAgICAgICAgICBpZiAoZXJyb3JSZXNwb25zZVsnc3RhdHVzJ10gPT0gNDAxKSB7XG5cbiAgICAgICAgICAgICAgICAvL0JyZWFrIENvZGUgLSBUZW1wb3JhcnlcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hdXRoLnJlZnJlc2hUb2tlbiA9PT0gJzEnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihKU09OLnN0cmluZ2lmeShlLnJlc3BvbnNlPy5kYXRhIHx8IGUpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmF1dGggPSBhd2FpdCB0aGlzLnJlZnJlc2hUb2tlbigpO1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucmVzYXZlVG9rZW4odGhpcy5hdXRoKVxuXG4gICAgICAgICAgICAgICAgdGhpcy5hcGlJbnN0YW5jZS5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnQXV0aG9yaXphdGlvbiddID0gYEJlYXJlciAke3RoaXMuYXV0aC5hY2Nlc3NUb2tlbn1gO1xuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmdldFByb2plY3RzKGNvbXBhbnlJZClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKEpTT04uc3RyaW5naWZ5KGUucmVzcG9uc2U/LmRhdGEgfHwgZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0VXNlcnMoY29tcGFueUlkOiBudW1iZXIpIDogUHJvbWlzZTxQcm9jb3JlVXNlck1vZGVsW10+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0OiBQcm9jb3JlVXNlck1vZGVsW10gPSBbXTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy5hcGlJbnN0YW5jZVxuICAgICAgICAgICAgLmdldCgnL3VzZXJzJywgeyBwYXJhbXM6IHsgY29tcGFueV9pZDogY29tcGFueUlkIH0gLCBoZWFkZXJzOiB7ICdQcm9jb3JlLUNvbXBhbnktSWQnOiBgJHtjb21wYW55SWR9YH19KVxuICAgICAgICAgICAgZm9yICh2YXIgdXNlckRhdGEgb2YgZGF0YSkge1xuICAgICAgICAgICAgICAgIGxldCB1c2VyID0gT2JqZWN0LmFzc2lnbihuZXcgUHJvY29yZVVzZXJNb2RlbCgpLCB1c2VyRGF0YSk7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godXNlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2goZTphbnkpIHtcbiAgICAgICAgICAgIC8vRm9yIHNvbWUgcmVhc29uLCBDYW5ub3QgYWNlc3Mgc3RhdHVzIG9uIGVycm9yIFJlc3BvbnNlXG4gICAgICAgICAgICBjb25zdCBlcnJvclJlc3BvbnNlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShlKSk7XG4gICAgICAgICAgICBpZiAoZXJyb3JSZXNwb25zZVsnc3RhdHVzJ10gPT0gNDAxKSB7XG5cbiAgICAgICAgICAgICAgICAvL0JyZWFrIENvZGUgLSBUZW1wb3JhcnlcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hdXRoLnJlZnJlc2hUb2tlbiA9PT0gJzEnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihKU09OLnN0cmluZ2lmeShlLnJlc3BvbnNlPy5kYXRhIHx8IGUpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmF1dGggPSBhd2FpdCB0aGlzLnJlZnJlc2hUb2tlbigpOztcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnJlc2F2ZVRva2VuKHRoaXMuYXV0aClcblxuICAgICAgICAgICAgICAgIHRoaXMuYXBpSW5zdGFuY2UuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ0F1dGhvcml6YXRpb24nXSA9IGBCZWFyZXIgJHt0aGlzLmF1dGguYWNjZXNzVG9rZW59YDtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5nZXRVc2Vycyhjb21wYW55SWQpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihKU09OLnN0cmluZ2lmeShlLnJlc3BvbnNlPy5kYXRhIHx8IGUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxufVxuIl19