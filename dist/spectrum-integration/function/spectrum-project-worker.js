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
                        stringValue: `${config === null || config === void 0 ? void 0 : config.spectrumUrl}:${config === null || config === void 0 ? void 0 : config.spectrumPort}`
                    },
                    companyCodes: {
                        stringListValues: config === null || config === void 0 ? void 0 : config.companyCodes
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlY3RydW0tcHJvamVjdC13b3JrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjdHJ1bS1pbnRlZ3JhdGlvbi9mdW5jdGlvbi9zcGVjdHJ1bS1wcm9qZWN0LXdvcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwrQkFBMkM7QUFDM0Msd0RBQTJEO0FBQzNELDhEQUF5RjtBQUN6Rix1Q0FBdUQ7QUFDdkQsK0JBQWdDO0FBRWhDLFVBQVU7QUFDVixNQUFNLElBQUksR0FBRyxLQUFLLEVBQUUsS0FBVSxFQUFFLE9BQWlCLEVBQUUsVUFBc0IsRUFBRSxFQUFFO0lBQzNFLE1BQU0sTUFBTSxHQUFHLENBQUEsVUFBVSxhQUFWLFVBQVUsdUJBQVYsVUFBVSxDQUFFLE1BQU0sS0FBSSxPQUFPLENBQUMsR0FBRyxDQUFDO0lBQ2pELElBQUEsZUFBUSxFQUFDLDRCQUE0QixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtJQUMvRCxJQUFBLGVBQVEsRUFBQyxZQUFZLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7SUFDekMsSUFBQSxlQUFRLEVBQUMsY0FBYyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBRTdDLE1BQU0sQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0lBQ3pDLElBQUksWUFBWSxHQUFHLElBQUkscUJBQVksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0lBRWhFLElBQUksQ0FBQztRQUNILFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUVwQixNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDO1FBQ25ELElBQUksVUFBVSxHQUFHLElBQUksd0JBQWtCLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUMzRCxJQUFJLFNBQVMs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QUFNLHVCQUFOLE1BQU0sQ0FBRSxPQUFPO3FCQUM3QjtvQkFDRCxRQUFRLEVBQUU7d0JBQ1IsV0FBVyxFQUFFLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxRQUFRO3FCQUM5QjtpQkFDRjthQUNGO1NBQ0Y7S0FDRixDQUFDO0lBRUYsT0FBTyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3hELENBQUMsQ0FBQTtBQXJDWSxRQUFBLDZCQUE2QixpQ0FxQ3pDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29udGV4dCwgSGFuZGxlciB9IGZyb20gXCJhd3MtbGFtYmRhXCI7XG5pbXBvcnQgeyBTcGVjdHJ1bVByb2plY3RKb2IgfSBmcm9tIFwiLi9qb2JcIjtcbmltcG9ydCB7IEpvYlN0YXR1cyB9IGZyb20gXCIuLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy9qb2JcIjtcbmltcG9ydCB7IEtQQUhhbmRsZXIsIEtQQU9wdGlvbnMsIFdvcmtlclN0YXR1cyB9IGZyb20gXCIuLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy93b3JrZXJcIjtcbmltcG9ydCB7IEtQQVNwZWN0cnVtQ29uZmlndXJhdGlvbkRCIH0gZnJvbSBcIi4vbW9uZ29kYlwiO1xuaW1wb3J0IHsgZGVidWdsb2cgfSBmcm9tICd1dGlsJztcblxuLy8gSGFuZGxlclxuY29uc3QgZXhlYyA9IGFzeW5jIChldmVudDogYW55LCBjb250ZXh0PzogQ29udGV4dCwga3BhT3B0aW9ucz86S1BBT3B0aW9ucykgPT4ge1xuICBjb25zdCBsb2dnZXIgPSBrcGFPcHRpb25zPy5sb2dnZXIgfHwgY29uc29sZS5sb2c7XG4gIGRlYnVnbG9nKCcjIyBFTlZJUk9OTUVOVCBWQVJJQUJMRVM6ICcgKyBzZXJpYWxpemUocHJvY2Vzcy5lbnYpKVxuICBkZWJ1Z2xvZygnIyMgRVZFTlQ6ICcgKyBzZXJpYWxpemUoZXZlbnQpKVxuICBkZWJ1Z2xvZygnIyMgQ09OVEVYVDogJyArIHNlcmlhbGl6ZShjb250ZXh0KSlcbiAgXG4gIGxvZ2dlcihcIkV4ZWN1dGUgU3BlY3RydW0gUHJvamVjdCBTdGFydFwiKTtcbiAgbGV0IHdvcmtlclN0YXR1cyA9IG5ldyBXb3JrZXJTdGF0dXMoJ1NwZWN0cnVtIFByb2plY3QgSGFuZGxlcicpO1xuICBcbiAgdHJ5IHtcbiAgICB3b3JrZXJTdGF0dXMuc3RhcnQoKVxuXG4gICAgY29uc3QgcmVjb3JkID0gZXZlbnQuUmVjb3Jkc1swXTtcbiAgICBjb25zdCBtZXNzYWdlQXR0cmlidXRlcyA9IHJlY29yZC5tZXNzYWdlQXR0cmlidXRlcztcbiAgICBsZXQgcHJvamVjdEpvYiA9IG5ldyBTcGVjdHJ1bVByb2plY3RKb2IobWVzc2FnZUF0dHJpYnV0ZXMpO1xuICAgIGxldCBqb2JTdGF0dXMgPSBuZXcgSm9iU3RhdHVzKHByb2plY3RKb2IubmFtZSk7XG4gICAgd29ya2VyU3RhdHVzLmpvYkxvZy5wdXNoKGpvYlN0YXR1cyk7XG5cbiAgICB0cnkge1xuICAgICAgam9iU3RhdHVzLnN0YXJ0KClcbiAgICAgIGF3YWl0IHByb2plY3RKb2IuZXhlY3V0ZShqb2JTdGF0dXMpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgam9iU3RhdHVzLmVycm9yID0gU3RyaW5nKGUpXG4gICAgICAgIHRocm93IGU7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgam9iU3RhdHVzLmRvbmUoKVxuICAgIH1cbiAgICBcbiAgfSBjYXRjaChlKSB7XG4gICAgd29ya2VyU3RhdHVzLmVycm9yID0gU3RyaW5nKGUpO1xuICAgIGxvZ2dlcihgV29ya2VyIFN0b3Agd2l0aCBVbmV4cGVjdGVkIEVycm9yIDogJHtlfWApO1xuICB9IGZpbmFsbHkge1xuICAgIHdvcmtlclN0YXR1cy5kb25lKClcbiAgfVxuICBcbiAgbG9nZ2VyKFwiRXhlY3V0ZSBTcGVjdHJ1bSBQcm9qZWN0IERvbmVcIik7XG4gIFxuICBjb25zdCByZXNwb25zZSA9IHtcbiAgICBcInN0YXR1c0NvZGVcIjogMjAwLFxuICAgIFwic291cmNlXCI6IFwiU3BlY3RydW0gUHJvamVjdCBJbnRlZ3JhdGlvblwiLFxuICAgIFwiYm9keVwiOiB3b3JrZXJTdGF0dXMsXG4gIH1cbiAgXG4gIHJldHVybiByZXNwb25zZVxufVxuXG52YXIgc2VyaWFsaXplID0gZnVuY3Rpb24ob2JqZWN0OiBhbnkpIHtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iamVjdCwgbnVsbCwgMilcbn1cblxuZXhwb3J0IGNvbnN0IHNwZWN0cnVtUHJvamVjdExhbWJkYUhhbmRsZXIgOiBIYW5kbGVyID0gYXN5bmMgKGV2ZW50OiBhbnksIGNvbnRleHQ6IENvbnRleHQpID0+IHtcbiAgcmV0dXJuIGV4ZWMoZXZlbnQsIGNvbnRleHQpO1xufVxuXG5leHBvcnQgY29uc3Qgc3BlY3RydW1Qcm9qZWN0U3luY0tQQUhhbmRsZXIgOiBLUEFIYW5kbGVyID0gYXN5bmMgKGV2ZW50OiBhbnksIGtwYU9wdGlvbnM6IEtQQU9wdGlvbnMpID0+IHtcblxuICBjb25zdCByZWNvcmQgPSBldmVudC5SZWNvcmRzWzBdO1xuICBjb25zdCBtZXNzYWdlQXR0cmlidXRlcyA9IHJlY29yZC5tZXNzYWdlQXR0cmlidXRlcztcbiAgbGV0IGtwYVRva2VuID0gbWVzc2FnZUF0dHJpYnV0ZXNbJ2twYVRva2VuJ11bJ3N0cmluZ1ZhbHVlJ107XG5cbiAgY29uc3QgY29uZmlnREIgPSBuZXcgS1BBU3BlY3RydW1Db25maWd1cmF0aW9uREIoKTtcbiAgbGV0IGNvbmZpZyA9IGF3YWl0IGNvbmZpZ0RCLmdldENvbmZpZ3VyYXRpb25CeUtwYVRva2VuKGtwYVRva2VuKTtcblxuICBjb25zdCBsYW1iZGFSZWNvcmRQcm94eSA9IHtcbiAgICBSZWNvcmRzOiBbXG4gICAgICB7XG4gICAgICAgIG1lc3NhZ2VBdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgc2VydmVyVXJsOiB7XG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogYCR7Y29uZmlnPy5zcGVjdHJ1bVVybH06JHtjb25maWc/LnNwZWN0cnVtUG9ydH1gXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb21wYW55Q29kZXM6IHtcbiAgICAgICAgICAgIHN0cmluZ0xpc3RWYWx1ZXM6IGNvbmZpZz8uY29tcGFueUNvZGVzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBhdXRob3JpemF0aW9uSWQ6IHtcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiBjb25maWc/LmF1dGhvcml6YXRpb25JZFxuICAgICAgICAgIH0sXG4gICAgICAgICAgaXNFZGl0UHJvamVjdDoge1xuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IGNvbmZpZz8uaXNFZGl0UHJvamVjdCA/ICcxJyA6ICcwJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGtwYVNpdGU6IHtcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiBjb25maWc/LmtwYVNpdGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIGtwYVRva2VuOiB7XG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogY29uZmlnPy5rcGFUb2tlblxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIF0sXG4gIH07XG5cbiAgcmV0dXJuIGV4ZWMobGFtYmRhUmVjb3JkUHJveHksIHVuZGVmaW5lZCwga3BhT3B0aW9ucyk7XG59XG4iXX0=