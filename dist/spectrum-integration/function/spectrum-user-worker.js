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
                        stringValue: config === null || config === void 0 ? void 0 : config.serverUrl
                    },
                    companyCode: {
                        stringValue: config === null || config === void 0 ? void 0 : config.companyCode
                    },
                    authorizationId: {
                        stringValue: config === null || config === void 0 ? void 0 : config.authorizationId
                    },
                    isEditUser: {
                        stringValue: (config === null || config === void 0 ? void 0 : config.isEditUser) ? '1' : '0',
                    },
                    kpaSite: {
                        stringValue: config === null || config === void 0 ? void 0 : config.kpaSite
                    },
                    kpaToken: {
                        stringValue: config === null || config === void 0 ? void 0 : config.kpaToken
                    },
                    defaultRole: {
                        stringValue: (config === null || config === void 0 ? void 0 : config.defaultRole) ? '1' : '0',
                    },
                    welcomeEmail: {
                        stringValue: (config === null || config === void 0 ? void 0 : config.isWelcomeEmail) ? '1' : '0',
                    },
                    resetPassword: {
                        stringValue: (config === null || config === void 0 ? void 0 : config.isForceResetPassword) ? '1' : '0',
                    },
                },
            },
        ],
    };
    return exec(lambdaRecordProxy, undefined, kpaOptions);
};
exports.spectrumUserSyncKPAHandler = spectrumUserSyncKPAHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlY3RydW0tdXNlci13b3JrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjdHJ1bS1pbnRlZ3JhdGlvbi9mdW5jdGlvbi9zcGVjdHJ1bS11c2VyLXdvcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw4REFBeUY7QUFDekYsK0JBQXdDO0FBQ3hDLHdEQUEyRDtBQUMzRCx1Q0FBdUQ7QUFDdkQsK0JBQWdDO0FBRWhDLFVBQVU7QUFDVixNQUFNLElBQUksR0FBRyxLQUFLLEVBQUUsS0FBVSxFQUFFLE9BQWlCLEVBQUUsVUFBc0IsRUFBRSxFQUFFO0lBQzNFLE1BQU0sTUFBTSxHQUFHLENBQUEsVUFBVSxhQUFWLFVBQVUsdUJBQVYsVUFBVSxDQUFFLE1BQU0sS0FBSSxPQUFPLENBQUMsR0FBRyxDQUFDO0lBQ2pELElBQUEsZUFBUSxFQUFDLDRCQUE0QixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtJQUMvRCxJQUFBLGVBQVEsRUFBQyxZQUFZLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7SUFDekMsSUFBQSxlQUFRLEVBQUMsY0FBYyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBRTdDLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0lBQ3RDLElBQUksWUFBWSxHQUFHLElBQUkscUJBQVksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0lBRTdELElBQUksQ0FBQztRQUNILFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUVwQixNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDO1FBQ25ELElBQUksT0FBTyxHQUFHLElBQUkscUJBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3JELElBQUksU0FBUyxHQUFHLElB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QUFFLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxRQUFRO3FCQUM5QjtvQkFDRCxXQUFXLEVBQUU7d0JBQ1gsV0FBVyxFQUFFLENBQUEsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLFdBQVcsRUFBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHO3FCQUM3QztvQkFDRCxZQUFZLEVBQUU7d0JBQ1osV0FBVyxFQUFFLENBQUEsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLGNBQWMsRUFBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHO3FCQUNoRDtvQkFDRCxhQUFhLEVBQUU7d0JBQ2IsV0FBVyxFQUFFLENBQUEsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLG9CQUFvQixFQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUc7cUJBQ3REO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGLENBQUM7SUFFRixPQUFPLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDeEQsQ0FBQyxDQUFBO0FBN0NZLFFBQUEsMEJBQTBCLDhCQTZDdEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb250ZXh0LCBIYW5kbGVyIH0gZnJvbSBcImF3cy1sYW1iZGFcIjtcbmltcG9ydCB7IEtQQUhhbmRsZXIsIEtQQU9wdGlvbnMsIFdvcmtlclN0YXR1cyB9IGZyb20gXCIuLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy93b3JrZXJcIjtcbmltcG9ydCB7IFNwZWN0cnVtVXNlckpvYiB9IGZyb20gXCIuL2pvYlwiO1xuaW1wb3J0IHsgSm9iU3RhdHVzIH0gZnJvbSBcIi4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL2pvYlwiO1xuaW1wb3J0IHsgS1BBU3BlY3RydW1Db25maWd1cmF0aW9uREIgfSBmcm9tIFwiLi9tb25nb2RiXCI7XG5pbXBvcnQgeyBkZWJ1Z2xvZyB9IGZyb20gJ3V0aWwnO1xuXG4vLyBIYW5kbGVyXG5jb25zdCBleGVjID0gYXN5bmMgKGV2ZW50OiBhbnksIGNvbnRleHQ/OiBDb250ZXh0LCBrcGFPcHRpb25zPzpLUEFPcHRpb25zKSA9PiB7XG4gIGNvbnN0IGxvZ2dlciA9IGtwYU9wdGlvbnM/LmxvZ2dlciB8fCBjb25zb2xlLmxvZztcbiAgZGVidWdsb2coJyMjIEVOVklST05NRU5UIFZBUklBQkxFUzogJyArIHNlcmlhbGl6ZShwcm9jZXNzLmVudikpXG4gIGRlYnVnbG9nKCcjIyBFVkVOVDogJyArIHNlcmlhbGl6ZShldmVudCkpXG4gIGRlYnVnbG9nKCcjIyBDT05URVhUOiAnICsgc2VyaWFsaXplKGNvbnRleHQpKVxuICBcbiAgbG9nZ2VyKFwiRXhlY3V0ZSBTcGVjdHJ1bSBVc2VyIFN0YXJ0XCIpO1xuICBsZXQgd29ya2VyU3RhdHVzID0gbmV3IFdvcmtlclN0YXR1cygnU3BlY3RydW0gVXNlciBIYW5kbGVyJyk7XG4gIFxuICB0cnkge1xuICAgIHdvcmtlclN0YXR1cy5zdGFydCgpXG5cbiAgICBjb25zdCByZWNvcmQgPSBldmVudC5SZWNvcmRzWzBdO1xuICAgIGNvbnN0IG1lc3NhZ2VBdHRyaWJ1dGVzID0gcmVjb3JkLm1lc3NhZ2VBdHRyaWJ1dGVzO1xuICAgIGxldCB1c2VySm9iID0gbmV3IFNwZWN0cnVtVXNlckpvYihtZXNzYWdlQXR0cmlidXRlcyk7XG4gICAgbGV0IGpvYlN0YXR1cyA9IG5ldyBKb2JTdGF0dXModXNlckpvYi5uYW1lKTtcbiAgICB3b3JrZXJTdGF0dXMuam9iTG9nLnB1c2goam9iU3RhdHVzKTtcblxuICAgIHRyeSB7XG4gICAgICBqb2JTdGF0dXMuc3RhcnQoKVxuICAgICAgYXdhaXQgdXNlckpvYi5leGVjdXRlKGpvYlN0YXR1cyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBqb2JTdGF0dXMuZXJyb3IgPSBTdHJpbmcoZSlcbiAgICAgICAgdGhyb3cgZTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICBqb2JTdGF0dXMuZG9uZSgpXG4gICAgfVxuICAgIFxuICB9IGNhdGNoKGUpIHtcbiAgICB3b3JrZXJTdGF0dXMuZXJyb3IgPSBTdHJpbmcoZSk7XG4gICAgbG9nZ2VyKGBXb3JrZXIgU3RvcCB3aXRoIFVuZXhwZWN0ZWQgRXJyb3IgOiAke2V9YCk7XG4gIH0gZmluYWxseSB7XG4gICAgd29ya2VyU3RhdHVzLmRvbmUoKVxuICB9XG4gIFxuICBsb2dnZXIoXCJFeGVjdXRlIFNwZWN0cnVtIFVzZXIgRG9uZVwiKTtcbiAgXG4gIGNvbnN0IHJlc3BvbnNlID0ge1xuICAgIFwic3RhdHVzQ29kZVwiOiAyMDAsXG4gICAgXCJzb3VyY2VcIjogXCJTcGVjdHJ1bSBQcm9qZWN0IEludGVncmF0aW9uXCIsXG4gICAgXCJib2R5XCI6IHdvcmtlclN0YXR1cyxcbiAgfVxuICBcbiAgcmV0dXJuIHJlc3BvbnNlXG59XG5cbnZhciBzZXJpYWxpemUgPSBmdW5jdGlvbihvYmplY3Q6IGFueSkge1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqZWN0LCBudWxsLCAyKVxufVxuXG5leHBvcnQgY29uc3Qgc3BlY3RydW1Vc2VyTGFtYmRhSGFuZGxlciA6IEhhbmRsZXIgPSBhc3luYyAoZXZlbnQ6IGFueSwgY29udGV4dDogQ29udGV4dCkgPT4ge1xuICByZXR1cm4gZXhlYyhldmVudCwgY29udGV4dCk7XG59XG5cbmV4cG9ydCBjb25zdCBzcGVjdHJ1bVVzZXJTeW5jS1BBSGFuZGxlciA6IEtQQUhhbmRsZXIgPSBhc3luYyAoZXZlbnQ6IGFueSwga3BhT3B0aW9uczogS1BBT3B0aW9ucykgPT4ge1xuICBjb25zdCByZWNvcmQgPSBldmVudC5SZWNvcmRzWzBdO1xuICBjb25zdCBtZXNzYWdlQXR0cmlidXRlcyA9IHJlY29yZC5tZXNzYWdlQXR0cmlidXRlcztcbiAgbGV0IGtwYVRva2VuID0gbWVzc2FnZUF0dHJpYnV0ZXNbJ2twYVRva2VuJ11bJ3N0cmluZ1ZhbHVlJ107XG5cbiAgY29uc3QgY29uZmlnREIgPSBuZXcgS1BBU3BlY3RydW1Db25maWd1cmF0aW9uREIoKTtcbiAgbGV0IGNvbmZpZyA9IGF3YWl0IGNvbmZpZ0RCLmdldENvbmZpZ3VyYXRpb25CeUtwYVRva2VuKGtwYVRva2VuKTtcblxuICBjb25zdCBsYW1iZGFSZWNvcmRQcm94eSA9IHtcbiAgICBSZWNvcmRzOiBbXG4gICAgICB7XG4gICAgICAgIG1lc3NhZ2VBdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgc2VydmVyVXJsOiB7XG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogY29uZmlnPy5zZXJ2ZXJVcmxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNvbXBhbnlDb2RlOiB7XG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogY29uZmlnPy5jb21wYW55Q29kZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgYXV0aG9yaXphdGlvbklkOiB7XG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogY29uZmlnPy5hdXRob3JpemF0aW9uSWRcbiAgICAgICAgICB9LFxuICAgICAgICAgIGlzRWRpdFVzZXI6IHtcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiBjb25maWc/LmlzRWRpdFVzZXIgPyAnMScgOiAnMCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBrcGFTaXRlOiB7XG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogY29uZmlnPy5rcGFTaXRlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBrcGFUb2tlbjoge1xuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IGNvbmZpZz8ua3BhVG9rZW5cbiAgICAgICAgICB9LFxuICAgICAgICAgIGRlZmF1bHRSb2xlOiB7XG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogY29uZmlnPy5kZWZhdWx0Um9sZSA/ICcxJyA6ICcwJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHdlbGNvbWVFbWFpbDoge1xuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IGNvbmZpZz8uaXNXZWxjb21lRW1haWwgPyAnMScgOiAnMCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICByZXNldFBhc3N3b3JkOiB7XG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogY29uZmlnPy5pc0ZvcmNlUmVzZXRQYXNzd29yZCA/ICcxJyA6ICcwJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdLFxuICB9O1xuXG4gIHJldHVybiBleGVjKGxhbWJkYVJlY29yZFByb3h5LCB1bmRlZmluZWQsIGtwYU9wdGlvbnMpO1xufVxuIl19