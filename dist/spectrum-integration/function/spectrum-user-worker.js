"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spectrumUserSyncKPAHandler = exports.spectrumUserLambdaHandler = void 0;
const worker_1 = require("../../base-integration/src/worker");
const job_1 = require("./job");
const job_2 = require("../../base-integration/src/job");
const mongodb_1 = require("./mongodb");
const util_1 = require("util");
// Handler
const exec = async (event, context, kpaOptions) => {
    const logger = (kpaOptions === null || kpaOptions === void 0 ? void 0 : kpaOptions.logger) || console.log;
    (0, util_1.debuglog)('## ENVIRONMENT VARIABLES: ' + serialize(process.env));
    (0, util_1.debuglog)('## EVENT: ' + serialize(event));
    (0, util_1.debuglog)('## CONTEXT: ' + serialize(context));
    logger("Execute Spectrum User Start");
    let workerStatus = new worker_1.WorkerStatus('Spectrum User Handler');
    try {
        workerStatus.start();
        const record = event.Records[0];
        const messageAttributes = record.messageAttributes;
        let userJob = new job_1.SpectrumUserJob(messageAttributes);
        let jobStatus = new job_2.JobStatus(userJob.name);
        workerStatus.jobLog.push(jobStatus);
        try {
            jobStatus.start();
            await userJob.execute(jobStatus);
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
    logger("Execute Spectrum User Done");
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
const spectrumUserLambdaHandler = async (event, context) => {
    return exec(event, context);
};
exports.spectrumUserLambdaHandler = spectrumUserLambdaHandler;
const spectrumUserSyncKPAHandler = async (event, kpaOptions) => {
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
                    isEditUser: {
                        stringValue: !!(config === null || config === void 0 ? void 0 : config.isEditUser),
                    },
                    kpaSite: {
                        stringValue: config === null || config === void 0 ? void 0 : config.kpaSite
                    },
                    kpaToken: {
                        stringValue: config === null || config === void 0 ? void 0 : config.kpaToken
                    },
                    defaultRole: {
                        stringValue: config === null || config === void 0 ? void 0 : config.defaultRole,
                    },
                    welcomeEmail: {
                        stringValue: !!(config === null || config === void 0 ? void 0 : config.isWelcomeEmail),
                    },
                    resetPassword: {
                        stringValue: !!(config === null || config === void 0 ? void 0 : config.isForceResetPassword),
                    },
                },
            },
        ],
    };
    return exec(lambdaRecordProxy, undefined, kpaOptions);
};
exports.spectrumUserSyncKPAHandler = spectrumUserSyncKPAHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlY3RydW0tdXNlci13b3JrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjdHJ1bS1pbnRlZ3JhdGlvbi9mdW5jdGlvbi9zcGVjdHJ1bS11c2VyLXdvcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw4REFBeUY7QUFDekYsK0JBQXdDO0FBQ3hDLHdEQUEyRDtBQUMzRCx1Q0FBdUQ7QUFDdkQsK0JBQWdDO0FBRWhDLFVBQVU7QUFDVixNQUFNLElBQUksR0FBRyxLQUFLLEVBQUUsS0FBVSxFQUFFLE9BQWlCLEVBQUUsVUFBc0IsRUFBRSxFQUFFO0lBQzNFLE1BQU0sTUFBTSxHQUFHLENBQUEsVUFBVSxhQUFWLFVBQVUsdUJBQVYsVUFBVSxDQUFFLE1BQU0sS0FBSSxPQUFPLENBQUMsR0FBRyxDQUFDO0lBQ2pELElBQUEsZUFBUSxFQUFDLDRCQUE0QixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtJQUMvRCxJQUFBLGVBQVEsRUFBQyxZQUFZLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7SUFDekMsSUFBQSxlQUFRLEVBQUMsY0FBYyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBRTdDLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0lBQ3RDLElBQUksWUFBWSxHQUFHLElBQUkscUJBQVksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0lBRTdELElBQUksQ0FBQztRQUNILFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUVwQixNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDO1FBQ25ELElBQUksT0FBTyxHQUFHLElBQUkscUJBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3JELElBQUksU0FBUyxHQUFHLElB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V0FBVyxFQUFFLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxPQUFPO3FCQUM3QjtvQkFDRCxRQUFRLEVBQUU7d0JBQ1IsV0FBVyxFQUFFLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxRQUFRO3FCQUM5QjtvQkFDRCxXQUFXLEVBQUU7d0JBQ1gsV0FBVyxFQUFFLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxXQUFXO3FCQUNqQztvQkFDRCxZQUFZLEVBQUU7d0JBQ1osV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFBLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxjQUFjLENBQUE7cUJBQ3RDO29CQUNELGFBQWEsRUFBRTt3QkFDYixXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUEsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLG9CQUFvQixDQUFBO3FCQUM1QztpQkFDRjthQUNGO1NBQ0Y7S0FDRixDQUFDO0lBRUYsT0FBTyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3hELENBQUMsQ0FBQTtBQTdDWSxRQUFBLDBCQUEwQiw4QkE2Q3RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29udGV4dCwgSGFuZGxlciB9IGZyb20gXCJhd3MtbGFtYmRhXCI7XG5pbXBvcnQgeyBLUEFIYW5kbGVyLCBLUEFPcHRpb25zLCBXb3JrZXJTdGF0dXMgfSBmcm9tIFwiLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvd29ya2VyXCI7XG5pbXBvcnQgeyBTcGVjdHJ1bVVzZXJKb2IgfSBmcm9tIFwiLi9qb2JcIjtcbmltcG9ydCB7IEpvYlN0YXR1cyB9IGZyb20gXCIuLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy9qb2JcIjtcbmltcG9ydCB7IEtQQVNwZWN0cnVtQ29uZmlndXJhdGlvbkRCIH0gZnJvbSBcIi4vbW9uZ29kYlwiO1xuaW1wb3J0IHsgZGVidWdsb2cgfSBmcm9tICd1dGlsJztcblxuLy8gSGFuZGxlclxuY29uc3QgZXhlYyA9IGFzeW5jIChldmVudDogYW55LCBjb250ZXh0PzogQ29udGV4dCwga3BhT3B0aW9ucz86S1BBT3B0aW9ucykgPT4ge1xuICBjb25zdCBsb2dnZXIgPSBrcGFPcHRpb25zPy5sb2dnZXIgfHwgY29uc29sZS5sb2c7XG4gIGRlYnVnbG9nKCcjIyBFTlZJUk9OTUVOVCBWQVJJQUJMRVM6ICcgKyBzZXJpYWxpemUocHJvY2Vzcy5lbnYpKVxuICBkZWJ1Z2xvZygnIyMgRVZFTlQ6ICcgKyBzZXJpYWxpemUoZXZlbnQpKVxuICBkZWJ1Z2xvZygnIyMgQ09OVEVYVDogJyArIHNlcmlhbGl6ZShjb250ZXh0KSlcblxuICBsb2dnZXIoXCJFeGVjdXRlIFNwZWN0cnVtIFVzZXIgU3RhcnRcIik7XG4gIGxldCB3b3JrZXJTdGF0dXMgPSBuZXcgV29ya2VyU3RhdHVzKCdTcGVjdHJ1bSBVc2VyIEhhbmRsZXInKTtcblxuICB0cnkge1xuICAgIHdvcmtlclN0YXR1cy5zdGFydCgpXG5cbiAgICBjb25zdCByZWNvcmQgPSBldmVudC5SZWNvcmRzWzBdO1xuICAgIGNvbnN0IG1lc3NhZ2VBdHRyaWJ1dGVzID0gcmVjb3JkLm1lc3NhZ2VBdHRyaWJ1dGVzO1xuICAgIGxldCB1c2VySm9iID0gbmV3IFNwZWN0cnVtVXNlckpvYihtZXNzYWdlQXR0cmlidXRlcyk7XG4gICAgbGV0IGpvYlN0YXR1cyA9IG5ldyBKb2JTdGF0dXModXNlckpvYi5uYW1lKTtcbiAgICB3b3JrZXJTdGF0dXMuam9iTG9nLnB1c2goam9iU3RhdHVzKTtcblxuICAgIHRyeSB7XG4gICAgICBqb2JTdGF0dXMuc3RhcnQoKVxuICAgICAgYXdhaXQgdXNlckpvYi5leGVjdXRlKGpvYlN0YXR1cyk7XG4gICAgfSBjYXRjaCAoZTphbnkpIHtcbiAgICAgIGpvYlN0YXR1cy5lcnJvciA9IHtcbiAgICAgICAgbWVzc2FnZTogU3RyaW5nKGUpLFxuICAgICAgICBzdGFjazogZS5zdGFjayxcbiAgICAgIH07XG4gICAgICB0aHJvdyBlO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAgIGpvYlN0YXR1cy5kb25lKClcbiAgICB9XG5cbiAgfSBjYXRjaChlKSB7XG4gICAgd29ya2VyU3RhdHVzLmVycm9yID0gU3RyaW5nKGUpO1xuICAgIGxvZ2dlcihgV29ya2VyIFN0b3Agd2l0aCBVbmV4cGVjdGVkIEVycm9yIDogJHtlfWApO1xuICB9IGZpbmFsbHkge1xuICAgIHdvcmtlclN0YXR1cy5kb25lKClcbiAgfVxuXG4gIGxvZ2dlcihcIkV4ZWN1dGUgU3BlY3RydW0gVXNlciBEb25lXCIpO1xuXG4gIGNvbnN0IHJlc3BvbnNlID0ge1xuICAgIFwic3RhdHVzQ29kZVwiOiAyMDAsXG4gICAgXCJzb3VyY2VcIjogXCJTcGVjdHJ1bSBQcm9qZWN0IEludGVncmF0aW9uXCIsXG4gICAgXCJib2R5XCI6IHdvcmtlclN0YXR1cyxcbiAgfVxuXG4gIHJldHVybiByZXNwb25zZVxufVxuXG52YXIgc2VyaWFsaXplID0gZnVuY3Rpb24ob2JqZWN0OiBhbnkpIHtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iamVjdCwgbnVsbCwgMilcbn1cblxuZXhwb3J0IGNvbnN0IHNwZWN0cnVtVXNlckxhbWJkYUhhbmRsZXIgOiBIYW5kbGVyID0gYXN5bmMgKGV2ZW50OiBhbnksIGNvbnRleHQ6IENvbnRleHQpID0+IHtcbiAgcmV0dXJuIGV4ZWMoZXZlbnQsIGNvbnRleHQpO1xufVxuXG5leHBvcnQgY29uc3Qgc3BlY3RydW1Vc2VyU3luY0tQQUhhbmRsZXIgOiBLUEFIYW5kbGVyID0gYXN5bmMgKGV2ZW50OiBhbnksIGtwYU9wdGlvbnM6IEtQQU9wdGlvbnMpID0+IHtcbiAgY29uc3QgcmVjb3JkID0gZXZlbnQuUmVjb3Jkc1swXTtcbiAgY29uc3QgbWVzc2FnZUF0dHJpYnV0ZXMgPSByZWNvcmQubWVzc2FnZUF0dHJpYnV0ZXM7XG4gIGxldCBrcGFUb2tlbiA9IG1lc3NhZ2VBdHRyaWJ1dGVzWydrcGFUb2tlbiddWydzdHJpbmdWYWx1ZSddO1xuXG4gIGNvbnN0IGNvbmZpZ0RCID0gbmV3IEtQQVNwZWN0cnVtQ29uZmlndXJhdGlvbkRCKCk7XG4gIGxldCBjb25maWcgPSBhd2FpdCBjb25maWdEQi5nZXRDb25maWd1cmF0aW9uQnlLcGFUb2tlbihrcGFUb2tlbik7XG5cbiAgY29uc3QgbGFtYmRhUmVjb3JkUHJveHkgPSB7XG4gICAgUmVjb3JkczogW1xuICAgICAge1xuICAgICAgICBtZXNzYWdlQXR0cmlidXRlczoge1xuICAgICAgICAgIHNlcnZlclVybDoge1xuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IGAke2NvbmZpZz8uc3BlY3RydW1Vcmx9OiR7Y29uZmlnPy5zcGVjdHJ1bVBvcnR9YFxuICAgICAgICAgIH0sXG4gICAgICAgICAgY29tcGFueUNvZGVzOiB7XG4gICAgICAgICAgICBzdHJpbmdMaXN0VmFsdWVzOiBjb25maWc/LmNvbXBhbnlDb2Rlc1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYXV0aG9yaXphdGlvbklkOiB7XG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogY29uZmlnPy5hdXRob3JpemF0aW9uSWRcbiAgICAgICAgICB9LFxuICAgICAgICAgIGlzRWRpdFVzZXI6IHtcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiAhIWNvbmZpZz8uaXNFZGl0VXNlcixcbiAgICAgICAgICB9LFxuICAgICAgICAgIGtwYVNpdGU6IHtcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiBjb25maWc/LmtwYVNpdGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIGtwYVRva2VuOiB7XG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogY29uZmlnPy5rcGFUb2tlblxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGVmYXVsdFJvbGU6IHtcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiBjb25maWc/LmRlZmF1bHRSb2xlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgd2VsY29tZUVtYWlsOiB7XG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogISFjb25maWc/LmlzV2VsY29tZUVtYWlsLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVzZXRQYXNzd29yZDoge1xuICAgICAgICAgICAgc3RyaW5nVmFsdWU6ICEhY29uZmlnPy5pc0ZvcmNlUmVzZXRQYXNzd29yZCxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdLFxuICB9O1xuXG4gIHJldHVybiBleGVjKGxhbWJkYVJlY29yZFByb3h5LCB1bmRlZmluZWQsIGtwYU9wdGlvbnMpO1xufVxuIl19