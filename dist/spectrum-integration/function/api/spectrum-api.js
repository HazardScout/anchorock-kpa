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
    async getUsers() {
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
                        'pStatus_Type': '',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlY3RydW0tYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3BlY3RydW0taW50ZWdyYXRpb24vZnVuY3Rpb24vYXBpL3NwZWN0cnVtLWFwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBcUM7QUFDckMsb0NBQW1FO0FBQ25FLHFEQUF3RDtBQUV4RCxNQUFhLFdBQVc7SUFRcEIsWUFBWSxTQUFpQixFQUFFLGVBQXVCLEVBQUUsV0FBbUI7UUFFdkUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLFdBQVcsU0FBUyxFQUFFLENBQUM7UUFDNUMsQ0FBQzthQUFNLENBQUM7WUFDSixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQTtRQUM5QixDQUFDO1FBRUQsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7UUFDdkMsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFFL0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxlQUFLLENBQUMsTUFBTSxDQUFDO1lBQzVCLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUztTQUMxQixDQUFDLENBQUE7UUFFRixNQUFNLEtBQUssR0FBRyxHQUFHLFdBQVcsSUFBSSxlQUFlLEVBQUUsQ0FBQztRQUNsRCxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxHQUFHLFNBQVMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUE7UUFDbEYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxZQUFZLENBQUE7UUFFdkUsTUFBTSxXQUFXLEdBQUc7WUFDaEIscUdBQXFHO1lBQ3JHLDJGQUEyRjtTQUM5RixDQUFDO1FBRUYsTUFBTSxPQUFPLEdBQUc7WUFD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USxFQUFFLEVBQUU7d0JBQ1osY0FBYyxFQUFFLEVBQUU7d0JBQ2xCLGNBQWMsRUFBRSxFQUFFO3dCQUNsQixVQUFVLEVBQUUsRUFBRTt3QkFDZCxTQUFTLEVBQUUscURBQXFEO3FCQUNuRTtpQkFDSjthQUNKO1NBQ0osQ0FBQTtRQUVELElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxpQkFBaUIsQ0FBQTtRQUMzRixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUVsRCxNQUFNLE1BQU0sR0FBd0IsRUFBRSxDQUFDO1FBQ3ZDLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQ3hFLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQy9DLE1BQU0sWUFBWSxHQUFHLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDM0osS0FBSSxJQUFJLElBQUksSUFBSSxZQUFZLEVBQUUsQ0FBQztZQUMzQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUkseUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtRQUM1QyxDQUFDO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztDQUNKO0FBN0hELGtDQTZIQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBheGlvcywgeyBBeGlvcyB9IGZyb20gXCJheGlvc1wiO1xuaW1wb3J0IHsgU3BlY3RydW1Qcm9qZWN0TW9kZWwsIFNwZWN0cnVtVXNlck1vZGVsIH0gZnJvbSBcIi4uL21vZGVsXCI7XG5pbXBvcnQgeyBYTUxQYXJzZXIsIFhNTEJ1aWxkZXIgfSBmcm9tIFwiZmFzdC14bWwtcGFyc2VyXCI7XG5cbmV4cG9ydCBjbGFzcyBTcGVjdHJ1bUFQSSB7XG4gICAgcHJpdmF0ZSBhcGlJbnN0YW5jZTogQXhpb3M7XG4gICAgcHJpdmF0ZSBzZXJ2ZXJVcmw6IHN0cmluZztcbiAgICBwcml2YXRlIGF1dGhvcml6YXRpb25JZDogc3RyaW5nO1xuICAgIHByaXZhdGUgY29tcGFueUNvZGU6IHN0cmluZztcbiAgICBwcml2YXRlIHhtbFBhcnNlcjogWE1MUGFyc2VyO1xuICAgIHByaXZhdGUgeG1sQnVpbGRlcjogWE1MQnVpbGRlcjtcblxuICAgIGNvbnN0cnVjdG9yKHNlcnZlclVybDogc3RyaW5nLCBhdXRob3JpemF0aW9uSWQ6IHN0cmluZywgY29tcGFueUNvZGU6IHN0cmluZykge1xuICAgICAgICBcbiAgICAgICAgaWYgKCFzZXJ2ZXJVcmwuaW5jbHVkZXMoJ2h0dHAnKSkgeyBcbiAgICAgICAgICAgIHRoaXMuc2VydmVyVXJsID0gYGh0dHBzOi8vJHtzZXJ2ZXJVcmx9YDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2VydmVyVXJsID0gc2VydmVyVXJsXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmF1dGhvcml6YXRpb25JZCA9IGF1dGhvcml6YXRpb25JZDtcbiAgICAgICAgdGhpcy5jb21wYW55Q29kZSA9IGNvbXBhbnlDb2RlO1xuXG4gICAgICAgIHRoaXMuYXBpSW5zdGFuY2UgPSBheGlvcy5jcmVhdGUoe1xuICAgICAgICAgICAgYmFzZVVSTDogdGhpcy5zZXJ2ZXJVcmxcbiAgICAgICAgfSlcblxuICAgICAgICBjb25zdCB0b2tlbiA9IGAke2NvbXBhbnlDb2RlfToke2F1dGhvcml6YXRpb25JZH1gO1xuICAgICAgICB0aGlzLmFwaUluc3RhbmNlLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydBdXRob3JpemF0aW9uJ10gPSBgQmFzaWMgJHtidG9hKHRva2VuKX1gXG4gICAgICAgIHRoaXMuYXBpSW5zdGFuY2UuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ0NvbnRlbnQtVHlwZSddID0gYHRleHQvcGxhaW5gXG5cbiAgICAgICAgY29uc3QgYWx3YXlzQXJyYXkgPSBbXG4gICAgICAgICAgICBcIlNPQVAtRU5WOkVudmVsb3BlLlNPQVAtRU5WOkJvZHkubmlzOkdldEVtcGxveWVlUmVzcG9uc2UucmV0dXJuQXJyYXkucmV0dXJuRGF0YS5nZXRFbXBsb3llZS5yZXNwb25zZVwiLFxuICAgICAgICAgICAgXCJTT0FQLUVOVjpFbnZlbG9wZS5TT0FQLUVOVjpCb2R5Lm5pczpHZXRKb2JSZXNwb25zZS5yZXR1cm5BcnJheS5yZXR1cm5EYXRhLmdldEpvYi5yZXNwb25zZVwiLFxuICAgICAgICBdO1xuXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBpZ25vcmVBdHRyaWJ1dGVzOiBmYWxzZSxcbiAgICAgICAgICAgIGF0dHJpYnV0ZU5hbWVQcmVmaXggOiBcIkBfXCIsXG4gICAgICAgICAgICBpc0FycmF5OiAobmFtZTogc3RyaW5nLCBqcGF0aDogc3RyaW5nLCBpc0xlYWZOb2RlOiBib29sZWFuLCBpc0F0dHJpYnV0ZTogYm9vbGVhbikgPT4geyBcbiAgICAgICAgICAgICAgICByZXR1cm4gKCBhbHdheXNBcnJheS5pbmRleE9mKGpwYXRoKSAhPT0gLTEpXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMueG1sUGFyc2VyID0gbmV3IFhNTFBhcnNlcihvcHRpb25zKTtcbiAgICAgICAgdGhpcy54bWxCdWlsZGVyID0gbmV3IFhNTEJ1aWxkZXIob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0UHJvamVjdHMoKSA6IFByb21pc2U8U3BlY3RydW1Qcm9qZWN0TW9kZWxbXT4ge1xuXG4gICAgICAgIGNvbnN0IHJlcXVlc3RKc29uID0ge1xuICAgICAgICAgICAgJz94bWwnOiB7XG4gICAgICAgICAgICAgICAgJ0BfdmVyc2lvbic6ICcxLjAnLCBcbiAgICAgICAgICAgICAgICAnQF9lbmNvZGluZyc6ICd1dGYtOCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnc29hcDpFbnZlbG9wZSc6IHtcbiAgICAgICAgICAgICAgICAnQF94bWxuczpzb2FwJzogJ2h0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3NvYXAvZW52ZWxvcGUvJyxcbiAgICAgICAgICAgICAgICAnc29hcDpCb2R5Jzoge1xuICAgICAgICAgICAgICAgICAgICAnR2V0Sm9iJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0F1dGhvcml6YXRpb25fSUQnOiB0aGlzLmF1dGhvcml6YXRpb25JZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICdHVUlEJzogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAncENvbXBhbnlfQ29kZSc6IHRoaXMuY29tcGFueUNvZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAncERpdmlzaW9uJzogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAncFN0YXR1c19Db2RlJzogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAncFByb2plY3RfTWFuYWdlcic6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3BTdXBlcmludGVuZGVudCc6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3BFc3RpbWF0b3InOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdwQ3VzdG9tZXJfQ29kZSc6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3BDb3N0X0NlbnRlcic6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3BTb3J0X0J5JzogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnQF94bWxucyc6ICdodHRwOi8vd3d3Lm5vcnRoZ2F0ZS1pcy5jb20vcHJvaXYvd2Vic2VydmljZXMvdHlwZXMnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFwaUluc3RhbmNlLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydTT0FQQWN0aW9uJ10gPSBgJHt0aGlzLnNlcnZlclVybH0vd3MvR2V0Sm9iYFxuICAgICAgICBjb25zdCB4bWxEYXRhID0gdGhpcy54bWxCdWlsZGVyLmJ1aWxkKHJlcXVlc3RKc29uKVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdDogU3BlY3RydW1Qcm9qZWN0TW9kZWxbXSA9IFtdO1xuICAgICAgICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHRoaXMuYXBpSW5zdGFuY2UucG9zdCgnL3dzL0dldEpvYicsIHhtbERhdGEpXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlRGF0YSA9IHRoaXMueG1sUGFyc2VyLnBhcnNlKGRhdGEpXG4gICAgICAgIGNvbnN0IHByb2plY3REYXRhID0gcmVzcG9uc2VEYXRhWydTT0FQLUVOVjpFbnZlbG9wZSddWydTT0FQLUVOVjpCb2R5J11bJ25pczpHZXRKb2JSZXNwb25zZSddWydyZXR1cm5BcnJheSddWydyZXR1cm5EYXRhJ11bJ2dldEpvYiddWydyZXNwb25zZSddO1xuICAgICAgICBmb3IodmFyIHByb2plY3Qgb2YgcHJvamVjdERhdGEpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5ldyBTcGVjdHJ1bVByb2plY3RNb2RlbChwcm9qZWN0KSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBcblxuICAgIGFzeW5jIGdldFVzZXJzKCkgOiBQcm9taXNlPFNwZWN0cnVtVXNlck1vZGVsW10+IHtcblxuICAgICAgICBjb25zdCByZXF1ZXN0SnNvbiA9IHtcbiAgICAgICAgICAgICc/eG1sJzoge1xuICAgICAgICAgICAgICAgICdAX3ZlcnNpb24nOiAnMS4wJywgXG4gICAgICAgICAgICAgICAgJ0BfZW5jb2RpbmcnOiAndXRmLTgnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3NvYXA6RW52ZWxvcGUnOiB7XG4gICAgICAgICAgICAgICAgJ0BfeG1sbnM6c29hcCc6ICdodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy9zb2FwL2VudmVsb3BlLycsXG4gICAgICAgICAgICAgICAgJ3NvYXA6Qm9keSc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0dldEVtcGxveWVlJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0F1dGhvcml6YXRpb25fSUQnOiB0aGlzLmF1dGhvcml6YXRpb25JZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICdHVUlEJzogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAncENvbXBhbnlfQ29kZSc6IHRoaXMuY29tcGFueUNvZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAncFdhZ2VfQ2xhc3MnOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdwVW5pb25fQ29kZSc6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3BPY2N1cGF0aW9uJzogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAncFRyYWRlJzogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAncFN0YXR1c19UeXBlJzogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAncENvc3RfQ2VudGVyJzogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAncFNvcnRfQnknOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdAX3htbG5zJzogJ2h0dHA6Ly93d3cubm9ydGhnYXRlLWlzLmNvbS9wcm9pdi93ZWJzZXJ2aWNlcy90eXBlcydcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYXBpSW5zdGFuY2UuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1NPQVBBY3Rpb24nXSA9IGAke3RoaXMuc2VydmVyVXJsfS93cy9HZXRFbXBsb3llZWBcbiAgICAgICAgY29uc3QgeG1sRGF0YSA9IHRoaXMueG1sQnVpbGRlci5idWlsZChyZXF1ZXN0SnNvbilcblxuICAgICAgICBjb25zdCByZXN1bHQ6IFNwZWN0cnVtVXNlck1vZGVsW10gPSBbXTtcbiAgICAgICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCB0aGlzLmFwaUluc3RhbmNlLnBvc3QoJy93cy9HZXRFbXBsb3llZScsIHhtbERhdGEpXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlRGF0YSA9IHRoaXMueG1sUGFyc2VyLnBhcnNlKGRhdGEpXG4gICAgICAgIGNvbnN0IGVtcGxveWVlRGF0YSA9IHJlc3BvbnNlRGF0YVsnU09BUC1FTlY6RW52ZWxvcGUnXVsnU09BUC1FTlY6Qm9keSddWyduaXM6R2V0RW1wbG95ZWVSZXNwb25zZSddWydyZXR1cm5BcnJheSddWydyZXR1cm5EYXRhJ11bJ2dldEVtcGxveWVlJ11bJ3Jlc3BvbnNlJ107XG4gICAgICAgIGZvcih2YXIgdXNlciBvZiBlbXBsb3llZURhdGEpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5ldyBTcGVjdHJ1bVVzZXJNb2RlbCh1c2VyKSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBcbn0iXX0=