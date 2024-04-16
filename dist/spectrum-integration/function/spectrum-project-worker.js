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
    (0, util_1.debuglog)('log:worker:spectrum:project:env')('## ENVIRONMENT VARIABLES: ' + serialize(process.env));
    (0, util_1.debuglog)('log:worker:spectrum:project')('## EVENT: ' + serialize(event));
    (0, util_1.debuglog)('log:worker:spectrum:project')('## CONTEXT: ' + serialize(context));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlY3RydW0tcHJvamVjdC13b3JrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjdHJ1bS1pbnRlZ3JhdGlvbi9mdW5jdGlvbi9zcGVjdHJ1bS1wcm9qZWN0LXdvcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwrQkFBMkM7QUFDM0Msd0RBQTJEO0FBQzNELDhEQUF5RjtBQUN6Rix1Q0FBdUQ7QUFDdkQsK0JBQWdDO0FBRWhDLFVBQVU7QUFDVixNQUFNLElBQUksR0FBRyxLQUFLLEVBQUUsS0FBVSxFQUFFLE9BQWlCLEVBQUUsVUFBc0IsRUFBRSxFQUFFO0lBQzNFLE1BQU0sTUFBTSxHQUFHLENBQUEsVUFBVSxhQUFWLFVBQVUsdUJBQVYsVUFBVSxDQUFFLE1BQU0sS0FBSSxPQUFPLENBQUMsR0FBRyxDQUFDO0lBQ2pELElBQUEsZUFBUSxFQUFDLGlDQUFpQyxDQUFDLENBQUMsNEJBQTRCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO0lBQ2xHLElBQUEsZUFBUSxFQUFDLDZCQUE2QixDQUFDLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFBO0lBQ3hFLElBQUEsZUFBUSxFQUFDLDZCQUE2QixDQUFDLENBQUMsY0FBYyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBRTVFLE1BQU0sQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0lBQ3pDLElBQUksWUFBWSxHQUFHLElBQUkscUJBQVksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0lBRWhFLElBQUksQ0FBQztRQUNILFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUVwQixNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDO1FBQ25ELElBQUksVUFBVSxHQUFH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LE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxhQUFhLEVBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRztxQkFDL0M7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLFdBQVcsRUFBRSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsT0FBTztxQkFDN0I7b0JBQ0QsUUFBUSxFQUFFO3dCQUNSLFdBQVcsRUFBRSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsUUFBUTtxQkFDOUI7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQztJQUVGLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN4RCxDQUFDLENBQUE7QUFyQ1ksUUFBQSw2QkFBNkIsaUNBcUN6QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnRleHQsIEhhbmRsZXIgfSBmcm9tIFwiYXdzLWxhbWJkYVwiO1xuaW1wb3J0IHsgU3BlY3RydW1Qcm9qZWN0Sm9iIH0gZnJvbSBcIi4vam9iXCI7XG5pbXBvcnQgeyBKb2JTdGF0dXMgfSBmcm9tIFwiLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvam9iXCI7XG5pbXBvcnQgeyBLUEFIYW5kbGVyLCBLUEFPcHRpb25zLCBXb3JrZXJTdGF0dXMgfSBmcm9tIFwiLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvd29ya2VyXCI7XG5pbXBvcnQgeyBLUEFTcGVjdHJ1bUNvbmZpZ3VyYXRpb25EQiB9IGZyb20gXCIuL21vbmdvZGJcIjtcbmltcG9ydCB7IGRlYnVnbG9nIH0gZnJvbSAndXRpbCc7XG5cbi8vIEhhbmRsZXJcbmNvbnN0IGV4ZWMgPSBhc3luYyAoZXZlbnQ6IGFueSwgY29udGV4dD86IENvbnRleHQsIGtwYU9wdGlvbnM/OktQQU9wdGlvbnMpID0+IHtcbiAgY29uc3QgbG9nZ2VyID0ga3BhT3B0aW9ucz8ubG9nZ2VyIHx8IGNvbnNvbGUubG9nO1xuICBkZWJ1Z2xvZygnbG9nOndvcmtlcjpzcGVjdHJ1bTpwcm9qZWN0OmVudicpKCcjIyBFTlZJUk9OTUVOVCBWQVJJQUJMRVM6ICcgKyBzZXJpYWxpemUocHJvY2Vzcy5lbnYpKVxuICBkZWJ1Z2xvZygnbG9nOndvcmtlcjpzcGVjdHJ1bTpwcm9qZWN0JykoJyMjIEVWRU5UOiAnICsgc2VyaWFsaXplKGV2ZW50KSlcbiAgZGVidWdsb2coJ2xvZzp3b3JrZXI6c3BlY3RydW06cHJvamVjdCcpKCcjIyBDT05URVhUOiAnICsgc2VyaWFsaXplKGNvbnRleHQpKVxuXG4gIGxvZ2dlcihcIkV4ZWN1dGUgU3BlY3RydW0gUHJvamVjdCBTdGFydFwiKTtcbiAgbGV0IHdvcmtlclN0YXR1cyA9IG5ldyBXb3JrZXJTdGF0dXMoJ1NwZWN0cnVtIFByb2plY3QgSGFuZGxlcicpO1xuXG4gIHRyeSB7XG4gICAgd29ya2VyU3RhdHVzLnN0YXJ0KClcblxuICAgIGNvbnN0IHJlY29yZCA9IGV2ZW50LlJlY29yZHNbMF07XG4gICAgY29uc3QgbWVzc2FnZUF0dHJpYnV0ZXMgPSByZWNvcmQubWVzc2FnZUF0dHJpYnV0ZXM7XG4gICAgbGV0IHByb2plY3RKb2IgPSBuZXcgU3BlY3RydW1Qcm9qZWN0Sm9iKG1lc3NhZ2VBdHRyaWJ1dGVzKTtcbiAgICBsZXQgam9iU3RhdHVzID0gbmV3IEpvYlN0YXR1cyhwcm9qZWN0Sm9iLm5hbWUpO1xuICAgIHdvcmtlclN0YXR1cy5qb2JMb2cucHVzaChqb2JTdGF0dXMpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGpvYlN0YXR1cy5zdGFydCgpXG4gICAgICBhd2FpdCBwcm9qZWN0Sm9iLmV4ZWN1dGUoam9iU3RhdHVzKTtcbiAgICB9IGNhdGNoIChlOmFueSkge1xuICAgICAgam9iU3RhdHVzLmVycm9yID0ge1xuICAgICAgICBtZXNzYWdlOiBTdHJpbmcoZSksXG4gICAgICAgIHN0YWNrOiBlLnN0YWNrLFxuICAgICAgfTtcbiAgICAgIHRocm93IGU7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgam9iU3RhdHVzLmRvbmUoKVxuICAgIH1cblxuICB9IGNhdGNoKGUpIHtcbiAgICB3b3JrZXJTdGF0dXMuZXJyb3IgPSBTdHJpbmcoZSk7XG4gICAgbG9nZ2VyKGBXb3JrZXIgU3RvcCB3aXRoIFVuZXhwZWN0ZWQgRXJyb3IgOiAke2V9YCk7XG4gIH0gZmluYWxseSB7XG4gICAgd29ya2VyU3RhdHVzLmRvbmUoKVxuICB9XG5cbiAgbG9nZ2VyKFwiRXhlY3V0ZSBTcGVjdHJ1bSBQcm9qZWN0IERvbmVcIik7XG5cbiAgY29uc3QgcmVzcG9uc2UgPSB7XG4gICAgXCJzdGF0dXNDb2RlXCI6IDIwMCxcbiAgICBcInNvdXJjZVwiOiBcIlNwZWN0cnVtIFByb2plY3QgSW50ZWdyYXRpb25cIixcbiAgICBcImJvZHlcIjogd29ya2VyU3RhdHVzLFxuICB9XG5cbiAgcmV0dXJuIHJlc3BvbnNlXG59XG5cbnZhciBzZXJpYWxpemUgPSBmdW5jdGlvbihvYmplY3Q6IGFueSkge1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqZWN0LCBudWxsLCAyKVxufVxuXG5leHBvcnQgY29uc3Qgc3BlY3RydW1Qcm9qZWN0TGFtYmRhSGFuZGxlciA6IEhhbmRsZXIgPSBhc3luYyAoZXZlbnQ6IGFueSwgY29udGV4dDogQ29udGV4dCkgPT4ge1xuICByZXR1cm4gZXhlYyhldmVudCwgY29udGV4dCk7XG59XG5cbmV4cG9ydCBjb25zdCBzcGVjdHJ1bVByb2plY3RTeW5jS1BBSGFuZGxlciA6IEtQQUhhbmRsZXIgPSBhc3luYyAoZXZlbnQ6IGFueSwga3BhT3B0aW9uczogS1BBT3B0aW9ucykgPT4ge1xuXG4gIGNvbnN0IHJlY29yZCA9IGV2ZW50LlJlY29yZHNbMF07XG4gIGNvbnN0IG1lc3NhZ2VBdHRyaWJ1dGVzID0gcmVjb3JkLm1lc3NhZ2VBdHRyaWJ1dGVzO1xuICBsZXQga3BhVG9rZW4gPSBtZXNzYWdlQXR0cmlidXRlc1sna3BhVG9rZW4nXVsnc3RyaW5nVmFsdWUnXTtcblxuICBjb25zdCBjb25maWdEQiA9IG5ldyBLUEFTcGVjdHJ1bUNvbmZpZ3VyYXRpb25EQigpO1xuICBsZXQgY29uZmlnID0gYXdhaXQgY29uZmlnREIuZ2V0Q29uZmlndXJhdGlvbkJ5S3BhVG9rZW4oa3BhVG9rZW4pO1xuXG4gIGNvbnN0IGxhbWJkYVJlY29yZFByb3h5ID0ge1xuICAgIFJlY29yZHM6IFtcbiAgICAgIHtcbiAgICAgICAgbWVzc2FnZUF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBzZXJ2ZXJVcmw6IHtcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiBgJHtjb25maWc/LnNwZWN0cnVtVXJsfToke2NvbmZpZz8uc3BlY3RydW1Qb3J0fWBcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNvbXBhbnlDb2Rlczoge1xuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IEpTT04uc3RyaW5naWZ5KGNvbmZpZz8uY29tcGFueUNvZGVzKVxuICAgICAgICAgIH0sXG4gICAgICAgICAgYXV0aG9yaXphdGlvbklkOiB7XG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogY29uZmlnPy5hdXRob3JpemF0aW9uSWRcbiAgICAgICAgICB9LFxuICAgICAgICAgIGlzRWRpdFByb2plY3Q6IHtcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiBjb25maWc/LmlzRWRpdFByb2plY3QgPyAnMScgOiAnMCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBrcGFTaXRlOiB7XG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogY29uZmlnPy5rcGFTaXRlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBrcGFUb2tlbjoge1xuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IGNvbmZpZz8ua3BhVG9rZW5cbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdLFxuICB9O1xuXG4gIHJldHVybiBleGVjKGxhbWJkYVJlY29yZFByb3h5LCB1bmRlZmluZWQsIGtwYU9wdGlvbnMpO1xufVxuIl19