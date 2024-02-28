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
        try {
            const { data } = await this.authInstance.post('', { grant_type: 'refresh_token', refresh_token: this.auth.refreshToken });
            const accessToken = data['access_token'];
            const refreshToken = data['refresh_token'];
            return new model_1.procoreContext(accessToken, refreshToken);
        }
        catch (e) {
            throw { 'message': 'Refresh Token Failed' };
        }
    }
    async getCompanies() {
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
                    throw { 'message': 'Request Failed - Invalid token and refresh token' };
                }
                this.auth = await this.refreshToken();
                await this.resaveToken(this.auth);
                this.apiInstance.defaults.headers.common['Authorization'] = `Bearer ${this.auth.accessToken}`;
                return await this.getCompanies();
            }
            else {
                throw { 'message': 'Request Failed' };
            }
        }
        return result;
    }
    async getProjects(companyId) {
        const result = [];
        try {
            const { data } = await this.apiInstance
                .get('/projects', { params: { company_id: companyId } });
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
                    throw { 'message': 'Request Failed - Invalid token and refresh token' };
                }
                this.auth = await this.refreshToken();
                await this.resaveToken(this.auth);
                this.apiInstance.defaults.headers.common['Authorization'] = `Bearer ${this.auth.accessToken}`;
                return await this.getProjects(companyId);
            }
            else {
                throw { 'message': 'Request Failed' };
            }
        }
        return result;
    }
    async getUsers(companyId) {
        const result = [];
        try {
            const { data } = await this.apiInstance
                .get('/users', { params: { company_id: companyId } });
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
                    throw { 'message': 'Request Failed - Invalid token and refresh token' };
                }
                this.auth = await this.refreshToken();
                ;
                await this.resaveToken(this.auth);
                this.apiInstance.defaults.headers.common['Authorization'] = `Bearer ${this.auth.accessToken}`;
                return await this.getUsers(companyId);
            }
            else {
                throw { 'message': 'Request Failed' };
            }
        }
        return result;
    }
}
exports.ProcoreAPI = ProcoreAPI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY29yZS1hcGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9jb3JlLWludGVncmF0aW9uL2Z1bmN0aW9uL2FwaS9wcm9jb3JlLWFwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBcUM7QUFDckMsb0NBQXNHO0FBRXRHLE1BQWEsVUFBVTtJQU1uQixZQUFZLElBQW9CLEVBQUUsV0FBb0Q7UUFDbEYsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFFL0IsSUFBSSxDQUFDLFlBQVksR0FBRyxlQUFLLENBQUMsTUFBTSxDQUFDO1lBQzdCLE9BQU8sRUFBRSx3Q0FBd0M7WUFDakQsNERBQTREO1NBQy9ELENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsa0JBQWtCLENBQUM7UUFDdkUsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxrQkFBa0IsQ0FBQztRQUU3RSxJQUFJLENBQUMsV0FBVyxHQUFHLGVBQUssQ0FBQyxNQUFNLENBQUM7WUFDNUIsT0FBTyxFQUFFLG9DQUFvQztZQUM3QyxvREFBb0Q7U0FDdkQsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsR0FBRyxVQUFVLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN6RixJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLGtCQUFrQixDQUFDO1FBQ3RFLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxD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QUN2QyxDQUFDO1FBQ0wsQ0FBQztRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7Q0FFSjtBQXRJRCxnQ0FzSUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MsIHsgQXhpb3MgfSBmcm9tIFwiYXhpb3NcIjtcbmltcG9ydCB7IHByb2NvcmVDb250ZXh0LCBQcm9jb3JlQ29tcGFueU1vZGVsLCBQcm9jb3JlUHJvamVjdE1vZGVsLCBQcm9jb3JlVXNlck1vZGVsIH0gZnJvbSBcIi4uL21vZGVsXCI7XG5cbmV4cG9ydCBjbGFzcyBQcm9jb3JlQVBJIHtcbiAgICBhdXRoOiBwcm9jb3JlQ29udGV4dDtcbiAgICBhdXRoSW5zdGFuY2U6IEF4aW9zO1xuICAgIGFwaUluc3RhbmNlOiBBeGlvcztcbiAgICByZXNhdmVUb2tlbjogKGF1dGg6IHByb2NvcmVDb250ZXh0KSA9PiBQcm9taXNlPHZvaWQ+O1xuXG4gICAgY29uc3RydWN0b3IoYXV0aDogcHJvY29yZUNvbnRleHQsIHJlc2F2ZVRva2VuOiAoYXV0aDogcHJvY29yZUNvbnRleHQpID0+IFByb21pc2U8dm9pZD4pIHtcbiAgICAgICAgdGhpcy5hdXRoID0gYXV0aDtcbiAgICAgICAgdGhpcy5yZXNhdmVUb2tlbiA9IHJlc2F2ZVRva2VuO1xuXG4gICAgICAgIHRoaXMuYXV0aEluc3RhbmNlID0gYXhpb3MuY3JlYXRlKHtcbiAgICAgICAgICAgIGJhc2VVUkw6ICdodHRwczovL2xvZ2luLnByb2NvcmUuY29tL29hdXRoL3Rva2VuLydcbiAgICAgICAgICAgIC8vIGJhc2VVUkw6ICdodHRwczovL2xvZ2luLXNhbmRib3gucHJvY29yZS5jb20vb2F1dGgvdG9rZW4vJ1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmF1dGhJbnN0YW5jZS5kZWZhdWx0cy5oZWFkZXJzLnBvc3RbJ0FjY2VwdCddID0gJ2FwcGxpY2F0aW9uL2pzb24nO1xuICAgICAgICB0aGlzLmF1dGhJbnN0YW5jZS5kZWZhdWx0cy5oZWFkZXJzLnBvc3RbJ0NvbnRlbnQtVHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb24nO1xuXG4gICAgICAgIHRoaXMuYXBpSW5zdGFuY2UgPSBheGlvcy5jcmVhdGUoe1xuICAgICAgICAgICAgYmFzZVVSTDogJ2h0dHBzOi8vYXBpLnByb2NvcmUuY29tL3Jlc3QvdjEuMC8nXG4gICAgICAgICAgICAvLyBiYXNlVVJMOiAnaHR0cHM6Ly9zYW5kYm94LnByb2NvcmUuY29tL3Jlc3QvdjEuMC8nXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuYXBpSW5zdGFuY2UuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ0F1dGhvcml6YXRpb24nXSA9IGBCZWFyZXIgJHthdXRoLmFjY2Vzc1Rva2VufWA7XG4gICAgICAgIHRoaXMuYXBpSW5zdGFuY2UuZGVmYXVsdHMuaGVhZGVycy5wb3N0WydBY2NlcHQnXSA9ICdhcHBsaWNhdGlvbi9qc29uJztcbiAgICAgICAgdGhpcy5hcGlJbnN0YW5jZS5kZWZhdWx0cy5oZWFkZXJzLnBvc3RbJ0NvbnRlbnQtVHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb24nO1xuICAgIH1cblxuICAgIGFzeW5jIHJlZnJlc2hUb2tlbigpOiBQcm9taXNlPHByb2NvcmVDb250ZXh0PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuYXV0aEluc3RhbmNlLnBvc3QoJycsIHtncmFudF90eXBlOiAncmVmcmVzaF90b2tlbicsIHJlZnJlc2hfdG9rZW46IHRoaXMuYXV0aC5yZWZyZXNoVG9rZW59KTtcblxuICAgICAgICAgICAgY29uc3QgYWNjZXNzVG9rZW4gPSBkYXRhWydhY2Nlc3NfdG9rZW4nXTtcbiAgICAgICAgICAgIGNvbnN0IHJlZnJlc2hUb2tlbiA9IGRhdGFbJ3JlZnJlc2hfdG9rZW4nXTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgcHJvY29yZUNvbnRleHQoYWNjZXNzVG9rZW4sIHJlZnJlc2hUb2tlbik7XG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgdGhyb3cgeydtZXNzYWdlJzonUmVmcmVzaCBUb2tlbiBGYWlsZWQnfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIGdldENvbXBhbmllcygpICA6IFByb21pc2U8UHJvY29yZUNvbXBhbnlNb2RlbFtdPntcbiAgICAgICAgY29uc3QgcmVzdWx0OiBQcm9jb3JlQ29tcGFueU1vZGVsW10gPSBbXTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy5hcGlJbnN0YW5jZVxuICAgICAgICAgICAgLmdldCgnL2NvbXBhbmllcycpXG4gICAgICAgICAgICBmb3IgKHZhciBjb21wYW55RGF0YSBvZiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNvbXBhbnkgPSBPYmplY3QuYXNzaWduKG5ldyBQcm9jb3JlQ29tcGFueU1vZGVsKCksIGNvbXBhbnlEYXRhKTtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChjb21wYW55KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICAvL0ZvciBzb21lIHJlYXNvbiwgQ2Fubm90IGFjZXNzIHN0YXR1cyBvbiBlcnJvciBSZXNwb25zZVxuICAgICAgICAgICAgY29uc3QgZXJyb3JSZXNwb25zZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZSkpO1xuICAgICAgICAgICAgaWYgKGVycm9yUmVzcG9uc2VbJ3N0YXR1cyddID09IDQwMSkge1xuXG4gICAgICAgICAgICAgICAgLy9CcmVhayBDb2RlIC0gVGVtcG9yYXJ5XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYXV0aC5yZWZyZXNoVG9rZW4gPT09ICcxJykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyB7J21lc3NhZ2UnOidSZXF1ZXN0IEZhaWxlZCAtIEludmFsaWQgdG9rZW4gYW5kIHJlZnJlc2ggdG9rZW4nfTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmF1dGggPSBhd2FpdCB0aGlzLnJlZnJlc2hUb2tlbigpO1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucmVzYXZlVG9rZW4odGhpcy5hdXRoKVxuXG4gICAgICAgICAgICAgICAgdGhpcy5hcGlJbnN0YW5jZS5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnQXV0aG9yaXphdGlvbiddID0gYEJlYXJlciAke3RoaXMuYXV0aC5hY2Nlc3NUb2tlbn1gO1xuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmdldENvbXBhbmllcygpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IHsnbWVzc2FnZSc6J1JlcXVlc3QgRmFpbGVkJ307XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRQcm9qZWN0cyhjb21wYW55SWQ6IG51bWJlcikgOiBQcm9taXNlPFByb2NvcmVQcm9qZWN0TW9kZWxbXT4ge1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdDogUHJvY29yZVByb2plY3RNb2RlbFtdID0gW107XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuYXBpSW5zdGFuY2VcbiAgICAgICAgICAgIC5nZXQoJy9wcm9qZWN0cycsIHsgcGFyYW1zOiB7IGNvbXBhbnlfaWQ6IGNvbXBhbnlJZCB9IH0pXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9qZWN0RGF0YSBvZiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgbGV0IHByb2plY3QgPSBPYmplY3QuYXNzaWduKG5ldyBQcm9jb3JlQ29tcGFueU1vZGVsKCksIHByb2plY3REYXRhKTtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChwcm9qZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICAvL0ZvciBzb21lIHJlYXNvbiwgQ2Fubm90IGFjZXNzIHN0YXR1cyBvbiBlcnJvciBSZXNwb25zZVxuICAgICAgICAgICAgY29uc3QgZXJyb3JSZXNwb25zZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZSkpO1xuICAgICAgICAgICAgaWYgKGVycm9yUmVzcG9uc2VbJ3N0YXR1cyddID09IDQwMSkge1xuXG4gICAgICAgICAgICAgICAgLy9CcmVhayBDb2RlIC0gVGVtcG9yYXJ5XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYXV0aC5yZWZyZXNoVG9rZW4gPT09ICcxJykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyB7J21lc3NhZ2UnOidSZXF1ZXN0IEZhaWxlZCAtIEludmFsaWQgdG9rZW4gYW5kIHJlZnJlc2ggdG9rZW4nfTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmF1dGggPSBhd2FpdCB0aGlzLnJlZnJlc2hUb2tlbigpO1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucmVzYXZlVG9rZW4odGhpcy5hdXRoKVxuXG4gICAgICAgICAgICAgICAgdGhpcy5hcGlJbnN0YW5jZS5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnQXV0aG9yaXphdGlvbiddID0gYEJlYXJlciAke3RoaXMuYXV0aC5hY2Nlc3NUb2tlbn1gO1xuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmdldFByb2plY3RzKGNvbXBhbnlJZClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgeydtZXNzYWdlJzonUmVxdWVzdCBGYWlsZWQnfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGFzeW5jIGdldFVzZXJzKGNvbXBhbnlJZDogbnVtYmVyKSA6IFByb21pc2U8UHJvY29yZVVzZXJNb2RlbFtdPiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdDogUHJvY29yZVVzZXJNb2RlbFtdID0gW107XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuYXBpSW5zdGFuY2VcbiAgICAgICAgICAgIC5nZXQoJy91c2VycycsIHsgcGFyYW1zOiB7IGNvbXBhbnlfaWQ6IGNvbXBhbnlJZCB9IH0pXG4gICAgICAgICAgICBmb3IgKHZhciB1c2VyRGF0YSBvZiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgbGV0IHVzZXIgPSBPYmplY3QuYXNzaWduKG5ldyBQcm9jb3JlVXNlck1vZGVsKCksIHVzZXJEYXRhKTtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh1c2VyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICAvL0ZvciBzb21lIHJlYXNvbiwgQ2Fubm90IGFjZXNzIHN0YXR1cyBvbiBlcnJvciBSZXNwb25zZVxuICAgICAgICAgICAgY29uc3QgZXJyb3JSZXNwb25zZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZSkpO1xuICAgICAgICAgICAgaWYgKGVycm9yUmVzcG9uc2VbJ3N0YXR1cyddID09IDQwMSkge1xuXG4gICAgICAgICAgICAgICAgLy9CcmVhayBDb2RlIC0gVGVtcG9yYXJ5XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYXV0aC5yZWZyZXNoVG9rZW4gPT09ICcxJykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyB7J21lc3NhZ2UnOidSZXF1ZXN0IEZhaWxlZCAtIEludmFsaWQgdG9rZW4gYW5kIHJlZnJlc2ggdG9rZW4nfTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmF1dGggPSBhd2FpdCB0aGlzLnJlZnJlc2hUb2tlbigpOztcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnJlc2F2ZVRva2VuKHRoaXMuYXV0aClcblxuICAgICAgICAgICAgICAgIHRoaXMuYXBpSW5zdGFuY2UuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ0F1dGhvcml6YXRpb24nXSA9IGBCZWFyZXIgJHt0aGlzLmF1dGguYWNjZXNzVG9rZW59YDtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5nZXRVc2Vycyhjb21wYW55SWQpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IHsnbWVzc2FnZSc6J1JlcXVlc3QgRmFpbGVkJ307XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbn1cbiJdfQ==