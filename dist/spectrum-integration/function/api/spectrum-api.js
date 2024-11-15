"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpectrumAPI = void 0;
const axios_1 = require("axios");
const model_1 = require("../model");
const fast_xml_parser_1 = require("fast-xml-parser");
class SpectrumAPI {
    constructor(serverUrl, authorizationId, companyCode) {
        if (!serverUrl.includes('http')) {
            this.serverUrl = `https://${serverUrl}`;
        }
        else {
            this.serverUrl = serverUrl;
        }
        this.authorizationId = authorizationId;
        this.companyCode = companyCode;
        this.apiInstance = axios_1.default.create({
            baseURL: this.serverUrl
        });
        const token = `${companyCode}:${authorizationId}`;
        this.apiInstance.defaults.headers.common['Authorization'] = `Basic ${btoa(token)}`;
        this.apiInstance.defaults.headers.common['Content-Type'] = `text/plain`;
        const alwaysArray = [
            "SOAP-ENV:Envelope.SOAP-ENV:Body.nis:GetEmployeeResponse.returnArray.returnData.getEmployee.response",
            "SOAP-ENV:Envelope.SOAP-ENV:Body.nis:GetJobResponse.returnArray.returnData.getJob.response",
        ];
        const options = {
            ignoreAttributes: false,
            attributeNamePrefix: "@_",
            isArray: (name, jpath, isLeafNode, isAttribute) => {
                return (alwaysArray.indexOf(jpath) !== -1);
            }
        };
        this.xmlParser = new fast_xml_parser_1.XMLParser(options);
        this.xmlBuilder = new fast_xml_parser_1.XMLBuilder(options);
    }
    async getProjects() {
        const requestJson = {
            '?xml': {
                '@_version': '1.0',
                '@_encoding': 'utf-8'
            },
            'soap:Envelope': {
                '@_xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
                'soap:Body': {
                    'GetJob': {
                        'Authorization_ID': this.authorizationId,
                        'GUID': '',
                        'pCompany_Code': this.companyCode,
                        'pDivision': '',
                        'pStatus_Code': '',
                        'pProject_Manager': '',
                        'pSuperintendent': '',
                        'pEstimator': '',
                        'pCustomer_Code': '',
                        'pCost_Center': '',
                        'pSort_By': '',
                        '@_xmlns': 'http://www.northgate-is.com/proiv/webservices/types'
                    }
                }
            }
        };
        this.apiInstance.defaults.headers.common['SOAPAction'] = `${this.serverUrl}/ws/GetJob`;
        const xmlData = this.xmlBuilder.build(requestJson);
        const result = [];
        const { data } = await this.apiInstance.post('/ws/GetJob', xmlData);
        const responseData = this.xmlParser.parse(data);
        const projectData = responseData['SOAP-ENV:Envelope']['SOAP-ENV:Body']['nis:GetJobResponse']['returnArray']['returnData']['getJob']['response'];
        for (var project of projectData) {
            result.push(new model_1.SpectrumProjectModel(project));
        }
        return result;
    }
    async getUsers(statusType = '') {
        const requestJson = {
            '?xml': {
                '@_version': '1.0',
                '@_encoding': 'utf-8'
            },
            'soap:Envelope': {
                '@_xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
                'soap:Body': {
                    'GetEmployee': {
                        'Authorization_ID': this.authorizationId,
                        'GUID': '',
                        'pCompany_Code': this.companyCode,
                        'pWage_Class': '',
                        'pUnion_Code': '',
                        'pOccupation': '',
                        'pTrade': '',
                        'pStatus_Type': statusType,
                        'pCost_Center': '',
                        'pSort_By': '',
                        '@_xmlns': 'http://www.northgate-is.com/proiv/webservices/types'
                    }
                }
            }
        };
        this.apiInstance.defaults.headers.common['SOAPAction'] = `${this.serverUrl}/ws/GetEmployee`;
        const xmlData = this.xmlBuilder.build(requestJson);
        const result = [];
        const { data } = await this.apiInstance.post('/ws/GetEmployee', xmlData);
        const responseData = this.xmlParser.parse(data);
        const employeeData = responseData['SOAP-ENV:Envelope']['SOAP-ENV:Body']['nis:GetEmployeeResponse']['returnArray']['returnData']['getEmployee']['response'];
        for (var user of employeeData) {
            result.push(new model_1.SpectrumUserModel(user));
        }
        return result;
    }
}
exports.SpectrumAPI = SpectrumAPI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlY3RydW0tYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3BlY3RydW0taW50ZWdyYXRpb24vZnVuY3Rpb24vYXBpL3NwZWN0cnVtLWFwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBcUM7QUFDckMsb0NBQW1FO0FBQ25FLHFEQUF3RDtBQUV4RCxNQUFhLFdBQVc7SUFRcEIsWUFBWSxTQUFpQixFQUFFLGVBQXVCLEVBQUUsV0FBbUI7UUFFdkUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLFdBQVcsU0FBUyxFQUFFLENBQUM7UUFDNUMsQ0FBQzthQUFNLENBQUM7WUFDSixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQTtRQUM5QixDQUFDO1FBRUQsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7UUFDdkMsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFFL0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxlQUFLLENBQUMsTUFBTSxDQUFDO1lBQzVCLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUztTQUMxQixDQUFDLENBQUE7UUFFRixNQUFNLEtBQUssR0FBRyxHQUFHLFdBQVcsSUFBSSxlQUFlLEVBQUUsQ0FBQztRQUNsRCxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxHQUFHLFNBQVMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUE7UUFDbEYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxZQUFZLENBQUE7UUFFdkUsTUFBTSxXQUFXLEdBQUc7WUFDaEIscUdBQXFHO1lBQ3JHLDJGQUEyRjtTQUM5RixDQUFDO1FBRUYsTUFBTSxPQUFPLEdBQUc7WUFD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RSxFQUFFO3dCQUNqQixRQUFRLEVBQUUsRUFBRTt3QkFDWixjQUFjLEVBQUUsVUFBVTt3QkFDMUIsY0FBYyxFQUFFLEVBQUU7d0JBQ2xCLFVBQVUsRUFBRSxFQUFFO3dCQUNkLFNBQVMsRUFBRSxxREFBcUQ7cUJBQ25FO2lCQUNKO2FBQ0o7U0FDSixDQUFBO1FBRUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLGlCQUFpQixDQUFBO1FBQzNGLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBRWxELE1BQU0sTUFBTSxHQUF3QixFQUFFLENBQUM7UUFDdkMsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDeEUsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDL0MsTUFBTSxZQUFZLEdBQUcsWUFBWSxDQUFDLG1CQUFtQixDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMseUJBQXlCLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMzSixLQUFJLElBQUksSUFBSSxJQUFJLFlBQVksRUFBRSxDQUFDO1lBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSx5QkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1FBQzVDLENBQUM7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0NBQ0o7QUE3SEQsa0NBNkhDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF4aW9zLCB7IEF4aW9zIH0gZnJvbSBcImF4aW9zXCI7XG5pbXBvcnQgeyBTcGVjdHJ1bVByb2plY3RNb2RlbCwgU3BlY3RydW1Vc2VyTW9kZWwgfSBmcm9tIFwiLi4vbW9kZWxcIjtcbmltcG9ydCB7IFhNTFBhcnNlciwgWE1MQnVpbGRlciB9IGZyb20gXCJmYXN0LXhtbC1wYXJzZXJcIjtcblxuZXhwb3J0IGNsYXNzIFNwZWN0cnVtQVBJIHtcbiAgICBwcml2YXRlIGFwaUluc3RhbmNlOiBBeGlvcztcbiAgICBwcml2YXRlIHNlcnZlclVybDogc3RyaW5nO1xuICAgIHByaXZhdGUgYXV0aG9yaXphdGlvbklkOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBjb21wYW55Q29kZTogc3RyaW5nO1xuICAgIHByaXZhdGUgeG1sUGFyc2VyOiBYTUxQYXJzZXI7XG4gICAgcHJpdmF0ZSB4bWxCdWlsZGVyOiBYTUxCdWlsZGVyO1xuXG4gICAgY29uc3RydWN0b3Ioc2VydmVyVXJsOiBzdHJpbmcsIGF1dGhvcml6YXRpb25JZDogc3RyaW5nLCBjb21wYW55Q29kZTogc3RyaW5nKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAoIXNlcnZlclVybC5pbmNsdWRlcygnaHR0cCcpKSB7IFxuICAgICAgICAgICAgdGhpcy5zZXJ2ZXJVcmwgPSBgaHR0cHM6Ly8ke3NlcnZlclVybH1gO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZXJ2ZXJVcmwgPSBzZXJ2ZXJVcmxcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYXV0aG9yaXphdGlvbklkID0gYXV0aG9yaXphdGlvbklkO1xuICAgICAgICB0aGlzLmNvbXBhbnlDb2RlID0gY29tcGFueUNvZGU7XG5cbiAgICAgICAgdGhpcy5hcGlJbnN0YW5jZSA9IGF4aW9zLmNyZWF0ZSh7XG4gICAgICAgICAgICBiYXNlVVJMOiB0aGlzLnNlcnZlclVybFxuICAgICAgICB9KVxuXG4gICAgICAgIGNvbnN0IHRva2VuID0gYCR7Y29tcGFueUNvZGV9OiR7YXV0aG9yaXphdGlvbklkfWA7XG4gICAgICAgIHRoaXMuYXBpSW5zdGFuY2UuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ0F1dGhvcml6YXRpb24nXSA9IGBCYXNpYyAke2J0b2EodG9rZW4pfWBcbiAgICAgICAgdGhpcy5hcGlJbnN0YW5jZS5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnQ29udGVudC1UeXBlJ10gPSBgdGV4dC9wbGFpbmBcblxuICAgICAgICBjb25zdCBhbHdheXNBcnJheSA9IFtcbiAgICAgICAgICAgIFwiU09BUC1FTlY6RW52ZWxvcGUuU09BUC1FTlY6Qm9keS5uaXM6R2V0RW1wbG95ZWVSZXNwb25zZS5yZXR1cm5BcnJheS5yZXR1cm5EYXRhLmdldEVtcGxveWVlLnJlc3BvbnNlXCIsXG4gICAgICAgICAgICBcIlNPQVAtRU5WOkVudmVsb3BlLlNPQVAtRU5WOkJvZHkubmlzOkdldEpvYlJlc3BvbnNlLnJldHVybkFycmF5LnJldHVybkRhdGEuZ2V0Sm9iLnJlc3BvbnNlXCIsXG4gICAgICAgIF07XG5cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGlnbm9yZUF0dHJpYnV0ZXM6IGZhbHNlLFxuICAgICAgICAgICAgYXR0cmlidXRlTmFtZVByZWZpeCA6IFwiQF9cIixcbiAgICAgICAgICAgIGlzQXJyYXk6IChuYW1lOiBzdHJpbmcsIGpwYXRoOiBzdHJpbmcsIGlzTGVhZk5vZGU6IGJvb2xlYW4sIGlzQXR0cmlidXRlOiBib29sZWFuKSA9PiB7IFxuICAgICAgICAgICAgICAgIHJldHVybiAoIGFsd2F5c0FycmF5LmluZGV4T2YoanBhdGgpICE9PSAtMSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy54bWxQYXJzZXIgPSBuZXcgWE1MUGFyc2VyKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLnhtbEJ1aWxkZXIgPSBuZXcgWE1MQnVpbGRlcihvcHRpb25zKTtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRQcm9qZWN0cygpIDogUHJvbWlzZTxTcGVjdHJ1bVByb2plY3RNb2RlbFtdPiB7XG5cbiAgICAgICAgY29uc3QgcmVxdWVzdEpzb24gPSB7XG4gICAgICAgICAgICAnP3htbCc6IHtcbiAgICAgICAgICAgICAgICAnQF92ZXJzaW9uJzogJzEuMCcsIFxuICAgICAgICAgICAgICAgICdAX2VuY29kaW5nJzogJ3V0Zi04J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdzb2FwOkVudmVsb3BlJzoge1xuICAgICAgICAgICAgICAgICdAX3htbG5zOnNvYXAnOiAnaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvc29hcC9lbnZlbG9wZS8nLFxuICAgICAgICAgICAgICAgICdzb2FwOkJvZHknOiB7XG4gICAgICAgICAgICAgICAgICAgICdHZXRKb2InOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnQXV0aG9yaXphdGlvbl9JRCc6IHRoaXMuYXV0aG9yaXphdGlvbklkLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ0dVSUQnOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdwQ29tcGFueV9Db2RlJzogdGhpcy5jb21wYW55Q29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICdwRGl2aXNpb24nOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdwU3RhdHVzX0NvZGUnOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdwUHJvamVjdF9NYW5hZ2VyJzogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAncFN1cGVyaW50ZW5kZW50JzogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAncEVzdGltYXRvcic6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3BDdXN0b21lcl9Db2RlJzogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAncENvc3RfQ2VudGVyJzogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAncFNvcnRfQnknOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdAX3htbG5zJzogJ2h0dHA6Ly93d3cubm9ydGhnYXRlLWlzLmNvbS9wcm9pdi93ZWJzZXJ2aWNlcy90eXBlcydcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYXBpSW5zdGFuY2UuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1NPQVBBY3Rpb24nXSA9IGAke3RoaXMuc2VydmVyVXJsfS93cy9HZXRKb2JgXG4gICAgICAgIGNvbnN0IHhtbERhdGEgPSB0aGlzLnhtbEJ1aWxkZXIuYnVpbGQocmVxdWVzdEpzb24pXG5cbiAgICAgICAgY29uc3QgcmVzdWx0OiBTcGVjdHJ1bVByb2plY3RNb2RlbFtdID0gW107XG4gICAgICAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgdGhpcy5hcGlJbnN0YW5jZS5wb3N0KCcvd3MvR2V0Sm9iJywgeG1sRGF0YSlcbiAgICAgICAgY29uc3QgcmVzcG9uc2VEYXRhID0gdGhpcy54bWxQYXJzZXIucGFyc2UoZGF0YSlcbiAgICAgICAgY29uc3QgcHJvamVjdERhdGEgPSByZXNwb25zZURhdGFbJ1NPQVAtRU5WOkVudmVsb3BlJ11bJ1NPQVAtRU5WOkJvZHknXVsnbmlzOkdldEpvYlJlc3BvbnNlJ11bJ3JldHVybkFycmF5J11bJ3JldHVybkRhdGEnXVsnZ2V0Sm9iJ11bJ3Jlc3BvbnNlJ107XG4gICAgICAgIGZvcih2YXIgcHJvamVjdCBvZiBwcm9qZWN0RGF0YSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2gobmV3IFNwZWN0cnVtUHJvamVjdE1vZGVsKHByb2plY3QpKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IFxuXG4gICAgYXN5bmMgZ2V0VXNlcnMoc3RhdHVzVHlwZTogc3RyaW5nID0gJycpIDogUHJvbWlzZTxTcGVjdHJ1bVVzZXJNb2RlbFtdPiB7XG5cbiAgICAgICAgY29uc3QgcmVxdWVzdEpzb24gPSB7XG4gICAgICAgICAgICAnP3htbCc6IHtcbiAgICAgICAgICAgICAgICAnQF92ZXJzaW9uJzogJzEuMCcsIFxuICAgICAgICAgICAgICAgICdAX2VuY29kaW5nJzogJ3V0Zi04J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdzb2FwOkVudmVsb3BlJzoge1xuICAgICAgICAgICAgICAgICdAX3htbG5zOnNvYXAnOiAnaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvc29hcC9lbnZlbG9wZS8nLFxuICAgICAgICAgICAgICAgICdzb2FwOkJvZHknOiB7XG4gICAgICAgICAgICAgICAgICAgICdHZXRFbXBsb3llZSc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdBdXRob3JpemF0aW9uX0lEJzogdGhpcy5hdXRob3JpemF0aW9uSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAnR1VJRCc6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3BDb21wYW55X0NvZGUnOiB0aGlzLmNvbXBhbnlDb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3BXYWdlX0NsYXNzJzogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAncFVuaW9uX0NvZGUnOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdwT2NjdXBhdGlvbic6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3BUcmFkZSc6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3BTdGF0dXNfVHlwZSc6IHN0YXR1c1R5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAncENvc3RfQ2VudGVyJzogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAncFNvcnRfQnknOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdAX3htbG5zJzogJ2h0dHA6Ly93d3cubm9ydGhnYXRlLWlzLmNvbS9wcm9pdi93ZWJzZXJ2aWNlcy90eXBlcydcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYXBpSW5zdGFuY2UuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1NPQVBBY3Rpb24nXSA9IGAke3RoaXMuc2VydmVyVXJsfS93cy9HZXRFbXBsb3llZWBcbiAgICAgICAgY29uc3QgeG1sRGF0YSA9IHRoaXMueG1sQnVpbGRlci5idWlsZChyZXF1ZXN0SnNvbilcblxuICAgICAgICBjb25zdCByZXN1bHQ6IFNwZWN0cnVtVXNlck1vZGVsW10gPSBbXTtcbiAgICAgICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLmFwaUluc3RhbmNlLnBvc3QoJy93cy9HZXRFbXBsb3llZScsIHhtbERhdGEpXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlRGF0YSA9IHRoaXMueG1sUGFyc2VyLnBhcnNlKGRhdGEpXG4gICAgICAgIGNvbnN0IGVtcGxveWVlRGF0YSA9IHJlc3BvbnNlRGF0YVsnU09BUC1FTlY6RW52ZWxvcGUnXVsnU09BUC1FTlY6Qm9keSddWyduaXM6R2V0RW1wbG95ZWVSZXNwb25zZSddWydyZXR1cm5BcnJheSddWydyZXR1cm5EYXRhJ11bJ2dldEVtcGxveWVlJ11bJ3Jlc3BvbnNlJ107XG4gICAgICAgIGZvcih2YXIgdXNlciBvZiBlbXBsb3llZURhdGEpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5ldyBTcGVjdHJ1bVVzZXJNb2RlbCh1c2VyKSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBcbn0iXX0=