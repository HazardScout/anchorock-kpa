import axios, { Axios } from "axios";
import { SpectrumProjectModel, SpectrumUserModel } from "../model";
import { XMLParser, XMLBuilder } from "fast-xml-parser";

export class SpectrumAPI {
    private apiInstance: Axios;
    private serverUrl: string;
    private authorizationId: string;
    private companyCode: string;
    private xmlParser: XMLParser;
    private xmlBuilder: XMLBuilder;

    constructor(serverUrl: string, authorizationId: string, companyCode: string) {
        
        if (!serverUrl.includes('http')) { 
            this.serverUrl = `https://${serverUrl}`;
        } else {
            this.serverUrl = serverUrl
        }

        this.authorizationId = authorizationId;
        this.companyCode = companyCode;

        this.apiInstance = axios.create({
            baseURL: this.serverUrl
        })

        const token = `${companyCode}:${authorizationId}`;
        this.apiInstance.defaults.headers.common['Authorization'] = `Basic ${btoa(token)}`
        this.apiInstance.defaults.headers.common['Content-Type'] = `text/plain`

        const alwaysArray = [
            "SOAP-ENV:Envelope.SOAP-ENV:Body.nis:GetEmployeeResponse.returnArray.returnData.getEmployee.response",
            "SOAP-ENV:Envelope.SOAP-ENV:Body.nis:GetJobResponse.returnArray.returnData.getJob.response",
        ];

        const options = {
            ignoreAttributes: false,
            attributeNamePrefix : "@_",
            isArray: (name: string, jpath: string, isLeafNode: boolean, isAttribute: boolean) => { 
                return ( alwaysArray.indexOf(jpath) !== -1)
            }
        };
        this.xmlParser = new XMLParser(options);
        this.xmlBuilder = new XMLBuilder(options);
    }

    async getProjects() : Promise<SpectrumProjectModel[]> {

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
        }

        this.apiInstance.defaults.headers.common['SOAPAction'] = `${this.serverUrl}/ws/GetJob`
        const xmlData = this.xmlBuilder.build(requestJson)

        const result: SpectrumProjectModel[] = [];
        const { data } = await this.apiInstance.post('/ws/GetJob', xmlData)
        const responseData = this.xmlParser.parse(data)
        const projectData = responseData['SOAP-ENV:Envelope']['SOAP-ENV:Body']['nis:GetJobResponse']['returnArray']['returnData']['getJob']['response'];
        for(var project of projectData) {
            result.push(new SpectrumProjectModel(project))
        }

        return result;
    } 

    async getUsers(statusType: string = '') : Promise<SpectrumUserModel[]> {

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
        }

        this.apiInstance.defaults.headers.common['SOAPAction'] = `${this.serverUrl}/ws/GetEmployee`
        const xmlData = this.xmlBuilder.build(requestJson)

        const result: SpectrumUserModel[] = [];
        const { data } = await this.apiInstance.post('/ws/GetEmployee', xmlData)
        const responseData = this.xmlParser.parse(data)
        const employeeData = responseData['SOAP-ENV:Envelope']['SOAP-ENV:Body']['nis:GetEmployeeResponse']['returnArray']['returnData']['getEmployee']['response'];
        for(var user of employeeData) {
            result.push(new SpectrumUserModel(user))
        }

        return result;
    } 
}