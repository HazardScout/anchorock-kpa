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
            jobStatus.error = {
                message: String(e),
                stack: e.stack,
            };
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
                        stringValue: `${config === null || config === void 0 ? void 0 : config.spectrumUrl}:${config === null || config === void 0 ? void 0 : config.spectrumPort}`
                    },
                    companyCodes: {
                        stringValue: JSON.stringify(config === null || config === void 0 ? void 0 : config.companyCodes)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlY3RydW0tcHJvamVjdC13b3JrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjdHJ1bS1pbnRlZ3JhdGlvbi9mdW5jdGlvbi9zcGVjdHJ1bS1wcm9qZWN0LXdvcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwrQkFBMkM7QUFDM0Msd0RBQTJEO0FBQzNELDhEQUF5RjtBQUN6Rix1Q0FBdUQ7QUFDdkQsK0JBQWdDO0FBRWhDLFVBQVU7QUFDVixNQUFNLElBQUksR0FBRyxLQUFLLEVBQUUsS0FBVSxFQUFFLE9BQWlCLEVBQUUsVUFBc0IsRUFBRSxFQUFFO0lBQzNFLE1BQU0sTUFBTSxHQUFHLENBQUEsVUFBVSxhQUFWLFVBQVUsdUJBQVYsVUFBVSxDQUFFLE1BQU0sS0FBSSxPQUFPLENBQUMsR0FBRyxDQUFDO0lBQ2pELElBQUEsZUFBUSxFQUFDLDRCQUE0QixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtJQUMvRCxJQUFBLGVBQVEsRUFBQyxZQUFZLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7SUFDekMsSUFBQSxlQUFRLEVBQUMsY0FBYyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBRTdDLE1BQU0sQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0lBQ3pDLElBQUksWUFBWSxHQUFHLElBQUkscUJBQVksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0lBRWhFLElBQUksQ0FBQztRQUNILFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUVwQixNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDO1FBQ25ELElBQUksVUFBVSxHQUFHLElBQUksd0JBQWtCLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUMzRCxJQUFJLFNBQVMs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LEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRztxQkFDL0M7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLFdBQVcsRUFBRSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsT0FBTztxQkFDN0I7b0JBQ0QsUUFBUSxFQUFFO3dCQUNSLFdBQVcsRUFBRSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsUUFBUTtxQkFDOUI7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQztJQUVGLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN4RCxDQUFDLENBQUE7QUFyQ1ksUUFBQSw2QkFBNkIsaUNBcUN6QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnRleHQsIEhhbmRsZXIgfSBmcm9tIFwiYXdzLWxhbWJkYVwiO1xuaW1wb3J0IHsgU3BlY3RydW1Qcm9qZWN0Sm9iIH0gZnJvbSBcIi4vam9iXCI7XG5pbXBvcnQgeyBKb2JTdGF0dXMgfSBmcm9tIFwiLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvam9iXCI7XG5pbXBvcnQgeyBLUEFIYW5kbGVyLCBLUEFPcHRpb25zLCBXb3JrZXJTdGF0dXMgfSBmcm9tIFwiLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvd29ya2VyXCI7XG5pbXBvcnQgeyBLUEFTcGVjdHJ1bUNvbmZpZ3VyYXRpb25EQiB9IGZyb20gXCIuL21vbmdvZGJcIjtcbmltcG9ydCB7IGRlYnVnbG9nIH0gZnJvbSAndXRpbCc7XG5cbi8vIEhhbmRsZXJcbmNvbnN0IGV4ZWMgPSBhc3luYyAoZXZlbnQ6IGFueSwgY29udGV4dD86IENvbnRleHQsIGtwYU9wdGlvbnM/OktQQU9wdGlvbnMpID0+IHtcbiAgY29uc3QgbG9nZ2VyID0ga3BhT3B0aW9ucz8ubG9nZ2VyIHx8IGNvbnNvbGUubG9nO1xuICBkZWJ1Z2xvZygnIyMgRU5WSVJPTk1FTlQgVkFSSUFCTEVTOiAnICsgc2VyaWFsaXplKHByb2Nlc3MuZW52KSlcbiAgZGVidWdsb2coJyMjIEVWRU5UOiAnICsgc2VyaWFsaXplKGV2ZW50KSlcbiAgZGVidWdsb2coJyMjIENPTlRFWFQ6ICcgKyBzZXJpYWxpemUoY29udGV4dCkpXG5cbiAgbG9nZ2VyKFwiRXhlY3V0ZSBTcGVjdHJ1bSBQcm9qZWN0IFN0YXJ0XCIpO1xuICBsZXQgd29ya2VyU3RhdHVzID0gbmV3IFdvcmtlclN0YXR1cygnU3BlY3RydW0gUHJvamVjdCBIYW5kbGVyJyk7XG5cbiAgdHJ5IHtcbiAgICB3b3JrZXJTdGF0dXMuc3RhcnQoKVxuXG4gICAgY29uc3QgcmVjb3JkID0gZXZlbnQuUmVjb3Jkc1swXTtcbiAgICBjb25zdCBtZXNzYWdlQXR0cmlidXRlcyA9IHJlY29yZC5tZXNzYWdlQXR0cmlidXRlcztcbiAgICBsZXQgcHJvamVjdEpvYiA9IG5ldyBTcGVjdHJ1bVByb2plY3RKb2IobWVzc2FnZUF0dHJpYnV0ZXMpO1xuICAgIGxldCBqb2JTdGF0dXMgPSBuZXcgSm9iU3RhdHVzKHByb2plY3RKb2IubmFtZSk7XG4gICAgd29ya2VyU3RhdHVzLmpvYkxvZy5wdXNoKGpvYlN0YXR1cyk7XG5cbiAgICB0cnkge1xuICAgICAgam9iU3RhdHVzLnN0YXJ0KClcbiAgICAgIGF3YWl0IHByb2plY3RKb2IuZXhlY3V0ZShqb2JTdGF0dXMpO1xuICAgIH0gY2F0Y2ggKGU6YW55KSB7XG4gICAgICBqb2JTdGF0dXMuZXJyb3IgPSB7XG4gICAgICAgIG1lc3NhZ2U6IFN0cmluZyhlKSxcbiAgICAgICAgc3RhY2s6IGUuc3RhY2ssXG4gICAgICB9O1xuICAgICAgdGhyb3cgZTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICBqb2JTdGF0dXMuZG9uZSgpXG4gICAgfVxuXG4gIH0gY2F0Y2goZSkge1xuICAgIHdvcmtlclN0YXR1cy5lcnJvciA9IFN0cmluZyhlKTtcbiAgICBsb2dnZXIoYFdvcmtlciBTdG9wIHdpdGggVW5leHBlY3RlZCBFcnJvciA6ICR7ZX1gKTtcbiAgfSBmaW5hbGx5IHtcbiAgICB3b3JrZXJTdGF0dXMuZG9uZSgpXG4gIH1cblxuICBsb2dnZXIoXCJFeGVjdXRlIFNwZWN0cnVtIFByb2plY3QgRG9uZVwiKTtcblxuICBjb25zdCByZXNwb25zZSA9IHtcbiAgICBcInN0YXR1c0NvZGVcIjogMjAwLFxuICAgIFwic291cmNlXCI6IFwiU3BlY3RydW0gUHJvamVjdCBJbnRlZ3JhdGlvblwiLFxuICAgIFwiYm9keVwiOiB3b3JrZXJTdGF0dXMsXG4gIH1cblxuICByZXR1cm4gcmVzcG9uc2Vcbn1cblxudmFyIHNlcmlhbGl6ZSA9IGZ1bmN0aW9uKG9iamVjdDogYW55KSB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmplY3QsIG51bGwsIDIpXG59XG5cbmV4cG9ydCBjb25zdCBzcGVjdHJ1bVByb2plY3RMYW1iZGFIYW5kbGVyIDogSGFuZGxlciA9IGFzeW5jIChldmVudDogYW55LCBjb250ZXh0OiBDb250ZXh0KSA9PiB7XG4gIHJldHVybiBleGVjKGV2ZW50LCBjb250ZXh0KTtcbn1cblxuZXhwb3J0IGNvbnN0IHNwZWN0cnVtUHJvamVjdFN5bmNLUEFIYW5kbGVyIDogS1BBSGFuZGxlciA9IGFzeW5jIChldmVudDogYW55LCBrcGFPcHRpb25zOiBLUEFPcHRpb25zKSA9PiB7XG5cbiAgY29uc3QgcmVjb3JkID0gZXZlbnQuUmVjb3Jkc1swXTtcbiAgY29uc3QgbWVzc2FnZUF0dHJpYnV0ZXMgPSByZWNvcmQubWVzc2FnZUF0dHJpYnV0ZXM7XG4gIGxldCBrcGFUb2tlbiA9IG1lc3NhZ2VBdHRyaWJ1dGVzWydrcGFUb2tlbiddWydzdHJpbmdWYWx1ZSddO1xuXG4gIGNvbnN0IGNvbmZpZ0RCID0gbmV3IEtQQVNwZWN0cnVtQ29uZmlndXJhdGlvbkRCKCk7XG4gIGxldCBjb25maWcgPSBhd2FpdCBjb25maWdEQi5nZXRDb25maWd1cmF0aW9uQnlLcGFUb2tlbihrcGFUb2tlbik7XG5cbiAgY29uc3QgbGFtYmRhUmVjb3JkUHJveHkgPSB7XG4gICAgUmVjb3JkczogW1xuICAgICAge1xuICAgICAgICBtZXNzYWdlQXR0cmlidXRlczoge1xuICAgICAgICAgIHNlcnZlclVybDoge1xuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IGAke2NvbmZpZz8uc3BlY3RydW1Vcmx9OiR7Y29uZmlnPy5zcGVjdHJ1bVBvcnR9YFxuICAgICAgICAgIH0sXG4gICAgICAgICAgY29tcGFueUNvZGVzOiB7XG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogSlNPTi5zdHJpbmdpZnkoY29uZmlnPy5jb21wYW55Q29kZXMpXG4gICAgICAgICAgfSxcbiAgICAgICAgICBhdXRob3JpemF0aW9uSWQ6IHtcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiBjb25maWc/LmF1dGhvcml6YXRpb25JZFxuICAgICAgICAgIH0sXG4gICAgICAgICAgaXNFZGl0UHJvamVjdDoge1xuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IGNvbmZpZz8uaXNFZGl0UHJvamVjdCA/ICcxJyA6ICcwJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGtwYVNpdGU6IHtcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiBjb25maWc/LmtwYVNpdGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIGtwYVRva2VuOiB7XG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogY29uZmlnPy5rcGFUb2tlblxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIF0sXG4gIH07XG5cbiAgcmV0dXJuIGV4ZWMobGFtYmRhUmVjb3JkUHJveHksIHVuZGVmaW5lZCwga3BhT3B0aW9ucyk7XG59XG4iXX0=