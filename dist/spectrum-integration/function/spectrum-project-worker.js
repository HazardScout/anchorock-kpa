"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spectrumProjectSyncKPAHandler = exports.spectrumProjectLambdaHandler = void 0;
const job_1 = require("./job");
const job_2 = require("../../base-integration/src/job");
const worker_1 = require("../../base-integration/src/worker");
const mongodb_1 = require("./mongodb");
const util_1 = require("util");
// Handler
const exec = async (event, context, kpaOptions) => {
    const logger = (kpaOptions === null || kpaOptions === void 0 ? void 0 : kpaOptions.logger) || console.log;
    (0, util_1.debuglog)('## ENVIRONMENT VARIABLES: ' + serialize(process.env));
    (0, util_1.debuglog)('## EVENT: ' + serialize(event));
    (0, util_1.debuglog)('## CONTEXT: ' + serialize(context));
    logger("Execute Spectrum Project Start");
    let workerStatus = new worker_1.WorkerStatus('Spectrum Project Handler');
    try {
        workerStatus.start();
        const record = event.Records[0];
        const messageAttributes = record.messageAttributes;
        let projectJob = new job_1.SpectrumProjectJob(messageAttributes);
        let jobStatus = new job_2.JobStatus(projectJob.name);
        workerStatus.jobLog.push(jobStatus);
        try {
            jobStatus.start();
            await projectJob.execute(jobStatus);
        }
        catch (e) {
            jobStatus.error = String(e);
            throw e;
        }
        finally {
            jobStatus.done();
        }
    }
    catch (e) {
        workerStatus.error = String(e);
        logger(`Worker Stop with Unexpected Error : ${e}`);
    }
    finally {
        workerStatus.done();
    }
    logger("Execute Spectrum Project Done");
    const response = {
        "statusCode": 200,
        "source": "Spectrum Project Integration",
        "body": workerStatus,
    };
    return response;
};
var serialize = function (object) {
    return JSON.stringify(object, null, 2);
};
const spectrumProjectLambdaHandler = async (event, context) => {
    return exec(event, context);
};
exports.spectrumProjectLambdaHandler = spectrumProjectLambdaHandler;
const spectrumProjectSyncKPAHandler = async (event, kpaOptions) => {
    const record = event.Records[0];
    const messageAttributes = record.messageAttributes;
    let kpaToken = messageAttributes['kpaToken']['stringValue'];
    const configDB = new mongodb_1.KPASpectrumConfigurationDB();
    let config = await configDB.getConfigurationByKpaToken(kpaToken);
    const lambdaRecordProxy = {
        Records: [
            {
                messageAttributes: {
                    serverUrl: {
                        stringValue: config === null || config === void 0 ? void 0 : config.serverUrl
                    },
                    companyCode: {
                        stringValue: config === null || config === void 0 ? void 0 : config.companyCode
                    },
                    authorizationId: {
                        stringValue: config === null || config === void 0 ? void 0 : config.authorizationId
                    },
                    isEditProject: {
                        stringValue: (config === null || config === void 0 ? void 0 : config.isEditProject) ? '1' : '0',
                    },
                    kpaSite: {
                        stringValue: config === null || config === void 0 ? void 0 : config.kpaSite
                    },
                    kpaToken: {
                        stringValue: config === null || config === void 0 ? void 0 : config.kpaToken
                    },
                },
            },
        ],
    };
    return exec(lambdaRecordProxy, undefined, kpaOptions);
};
exports.spectrumProjectSyncKPAHandler = spectrumProjectSyncKPAHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlY3RydW0tcHJvamVjdC13b3JrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjdHJ1bS1pbnRlZ3JhdGlvbi9mdW5jdGlvbi9zcGVjdHJ1bS1wcm9qZWN0LXdvcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwrQkFBMkM7QUFDM0Msd0RBQTJEO0FBQzNELDhEQUF5RjtBQUN6Rix1Q0FBdUQ7QUFDdkQsK0JBQWdDO0FBRWhDLFVBQVU7QUFDVixNQUFNLElBQUksR0FBRyxLQUFLLEVBQUUsS0FBVSxFQUFFLE9BQWlCLEVBQUUsVUFBc0IsRUFBRSxFQUFFO0lBQzNFLE1BQU0sTUFBTSxHQUFHLENBQUEsVUFBVSxhQUFWLFVBQVUsdUJBQVYsVUFBVSxDQUFFLE1BQU0sS0FBSSxPQUFPLENBQUMsR0FBRyxDQUFDO0lBQ2pELElBQUEsZUFBUSxFQUFDLDRCQUE0QixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtJQUMvRCxJQUFBLGVBQVEsRUFBQyxZQUFZLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7SUFDekMsSUFBQSxlQUFRLEVBQUMsY0FBYyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBRTdDLE1BQU0sQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0lBQ3pDLElBQUksWUFBWSxHQUFHLElBQUkscUJBQVksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0lBRWhFLElBQUksQ0FBQztRQUNILFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUVwQixNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDO1FBQ25ELElBQUksVUFBVSxHQUFHLElBQUksd0JBQWtCLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUMzRCxJQUFJLFNBQVMs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LFdBQVcsRUFBRSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsUUFBUTtxQkFDOUI7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQztJQUVGLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN4RCxDQUFDLENBQUE7QUFyQ1ksUUFBQSw2QkFBNkIsaUNBcUN6QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnRleHQsIEhhbmRsZXIgfSBmcm9tIFwiYXdzLWxhbWJkYVwiO1xuaW1wb3J0IHsgU3BlY3RydW1Qcm9qZWN0Sm9iIH0gZnJvbSBcIi4vam9iXCI7XG5pbXBvcnQgeyBKb2JTdGF0dXMgfSBmcm9tIFwiLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvam9iXCI7XG5pbXBvcnQgeyBLUEFIYW5kbGVyLCBLUEFPcHRpb25zLCBXb3JrZXJTdGF0dXMgfSBmcm9tIFwiLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvd29ya2VyXCI7XG5pbXBvcnQgeyBLUEFTcGVjdHJ1bUNvbmZpZ3VyYXRpb25EQiB9IGZyb20gXCIuL21vbmdvZGJcIjtcbmltcG9ydCB7IGRlYnVnbG9nIH0gZnJvbSAndXRpbCc7XG5cbi8vIEhhbmRsZXJcbmNvbnN0IGV4ZWMgPSBhc3luYyAoZXZlbnQ6IGFueSwgY29udGV4dD86IENvbnRleHQsIGtwYU9wdGlvbnM/OktQQU9wdGlvbnMpID0+IHtcbiAgY29uc3QgbG9nZ2VyID0ga3BhT3B0aW9ucz8ubG9nZ2VyIHx8IGNvbnNvbGUubG9nO1xuICBkZWJ1Z2xvZygnIyMgRU5WSVJPTk1FTlQgVkFSSUFCTEVTOiAnICsgc2VyaWFsaXplKHByb2Nlc3MuZW52KSlcbiAgZGVidWdsb2coJyMjIEVWRU5UOiAnICsgc2VyaWFsaXplKGV2ZW50KSlcbiAgZGVidWdsb2coJyMjIENPTlRFWFQ6ICcgKyBzZXJpYWxpemUoY29udGV4dCkpXG4gIFxuICBsb2dnZXIoXCJFeGVjdXRlIFNwZWN0cnVtIFByb2plY3QgU3RhcnRcIik7XG4gIGxldCB3b3JrZXJTdGF0dXMgPSBuZXcgV29ya2VyU3RhdHVzKCdTcGVjdHJ1bSBQcm9qZWN0IEhhbmRsZXInKTtcbiAgXG4gIHRyeSB7XG4gICAgd29ya2VyU3RhdHVzLnN0YXJ0KClcblxuICAgIGNvbnN0IHJlY29yZCA9IGV2ZW50LlJlY29yZHNbMF07XG4gICAgY29uc3QgbWVzc2FnZUF0dHJpYnV0ZXMgPSByZWNvcmQubWVzc2FnZUF0dHJpYnV0ZXM7XG4gICAgbGV0IHByb2plY3RKb2IgPSBuZXcgU3BlY3RydW1Qcm9qZWN0Sm9iKG1lc3NhZ2VBdHRyaWJ1dGVzKTtcbiAgICBsZXQgam9iU3RhdHVzID0gbmV3IEpvYlN0YXR1cyhwcm9qZWN0Sm9iLm5hbWUpO1xuICAgIHdvcmtlclN0YXR1cy5qb2JMb2cucHVzaChqb2JTdGF0dXMpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGpvYlN0YXR1cy5zdGFydCgpXG4gICAgICBhd2FpdCBwcm9qZWN0Sm9iLmV4ZWN1dGUoam9iU3RhdHVzKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGpvYlN0YXR1cy5lcnJvciA9IFN0cmluZyhlKVxuICAgICAgICB0aHJvdyBlO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAgIGpvYlN0YXR1cy5kb25lKClcbiAgICB9XG4gICAgXG4gIH0gY2F0Y2goZSkge1xuICAgIHdvcmtlclN0YXR1cy5lcnJvciA9IFN0cmluZyhlKTtcbiAgICBsb2dnZXIoYFdvcmtlciBTdG9wIHdpdGggVW5leHBlY3RlZCBFcnJvciA6ICR7ZX1gKTtcbiAgfSBmaW5hbGx5IHtcbiAgICB3b3JrZXJTdGF0dXMuZG9uZSgpXG4gIH1cbiAgXG4gIGxvZ2dlcihcIkV4ZWN1dGUgU3BlY3RydW0gUHJvamVjdCBEb25lXCIpO1xuICBcbiAgY29uc3QgcmVzcG9uc2UgPSB7XG4gICAgXCJzdGF0dXNDb2RlXCI6IDIwMCxcbiAgICBcInNvdXJjZVwiOiBcIlNwZWN0cnVtIFByb2plY3QgSW50ZWdyYXRpb25cIixcbiAgICBcImJvZHlcIjogd29ya2VyU3RhdHVzLFxuICB9XG4gIFxuICByZXR1cm4gcmVzcG9uc2Vcbn1cblxudmFyIHNlcmlhbGl6ZSA9IGZ1bmN0aW9uKG9iamVjdDogYW55KSB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmplY3QsIG51bGwsIDIpXG59XG5cbmV4cG9ydCBjb25zdCBzcGVjdHJ1bVByb2plY3RMYW1iZGFIYW5kbGVyIDogSGFuZGxlciA9IGFzeW5jIChldmVudDogYW55LCBjb250ZXh0OiBDb250ZXh0KSA9PiB7XG4gIHJldHVybiBleGVjKGV2ZW50LCBjb250ZXh0KTtcbn1cblxuZXhwb3J0IGNvbnN0IHNwZWN0cnVtUHJvamVjdFN5bmNLUEFIYW5kbGVyIDogS1BBSGFuZGxlciA9IGFzeW5jIChldmVudDogYW55LCBrcGFPcHRpb25zOiBLUEFPcHRpb25zKSA9PiB7XG5cbiAgY29uc3QgcmVjb3JkID0gZXZlbnQuUmVjb3Jkc1swXTtcbiAgY29uc3QgbWVzc2FnZUF0dHJpYnV0ZXMgPSByZWNvcmQubWVzc2FnZUF0dHJpYnV0ZXM7XG4gIGxldCBrcGFUb2tlbiA9IG1lc3NhZ2VBdHRyaWJ1dGVzWydrcGFUb2tlbiddWydzdHJpbmdWYWx1ZSddO1xuXG4gIGNvbnN0IGNvbmZpZ0RCID0gbmV3IEtQQVNwZWN0cnVtQ29uZmlndXJhdGlvbkRCKCk7XG4gIGxldCBjb25maWcgPSBhd2FpdCBjb25maWdEQi5nZXRDb25maWd1cmF0aW9uQnlLcGFUb2tlbihrcGFUb2tlbik7XG5cbiAgY29uc3QgbGFtYmRhUmVjb3JkUHJveHkgPSB7XG4gICAgUmVjb3JkczogW1xuICAgICAge1xuICAgICAgICBtZXNzYWdlQXR0cmlidXRlczoge1xuICAgICAgICAgIHNlcnZlclVybDoge1xuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IGNvbmZpZz8uc2VydmVyVXJsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb21wYW55Q29kZToge1xuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IGNvbmZpZz8uY29tcGFueUNvZGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIGF1dGhvcml6YXRpb25JZDoge1xuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IGNvbmZpZz8uYXV0aG9yaXphdGlvbklkXG4gICAgICAgICAgfSxcbiAgICAgICAgICBpc0VkaXRQcm9qZWN0OiB7XG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogY29uZmlnPy5pc0VkaXRQcm9qZWN0ID8gJzEnIDogJzAnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAga3BhU2l0ZToge1xuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IGNvbmZpZz8ua3BhU2l0ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAga3BhVG9rZW46IHtcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiBjb25maWc/LmtwYVRva2VuXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfTtcblxuICByZXR1cm4gZXhlYyhsYW1iZGFSZWNvcmRQcm94eSwgdW5kZWZpbmVkLCBrcGFPcHRpb25zKTtcbn1cbiJdfQ==