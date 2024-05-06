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
    (0, util_1.debuglog)('log:worker:spectrum:user:env')('## ENVIRONMENT VARIABLES: ' + serialize(process.env));
    (0, util_1.debuglog)('log:worker:spectrum:user')('## EVENT: ' + serialize(event));
    (0, util_1.debuglog)('log:worker:spectrum:user')('## CONTEXT: ' + serialize(context));
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
                        stringValue: JSON.stringify(config === null || config === void 0 ? void 0 : config.companyCodes)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlY3RydW0tdXNlci13b3JrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcGVjdHJ1bS1pbnRlZ3JhdGlvbi9mdW5jdGlvbi9zcGVjdHJ1bS11c2VyLXdvcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw4REFBeUY7QUFDekYsK0JBQXdDO0FBQ3hDLHdEQUEyRDtBQUMzRCx1Q0FBdUQ7QUFDdkQsK0JBQWdDO0FBRWhDLFVBQVU7QUFDVixNQUFNLElBQUksR0FBRyxLQUFLLEVBQUUsS0FBVSxFQUFFLE9BQWlCLEVBQUUsVUFBc0IsRUFBRSxFQUFFO0lBQzNFLE1BQU0sTUFBTSxHQUFHLENBQUEsVUFBVSxhQUFWLFVBQVUsdUJBQVYsVUFBVSxDQUFFLE1BQU0sS0FBSSxPQUFPLENBQUMsR0FBRyxDQUFDO0lBQ2pELElBQUEsZUFBUSxFQUFDLDhCQUE4QixDQUFDLENBQUMsNEJBQTRCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO0lBQy9GLElBQUEsZUFBUSxFQUFDLDBCQUEwQixDQUFDLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFBO0lBQ3JFLElBQUEsZUFBUSxFQUFDLDBCQUEwQixDQUFDLENBQUMsY0FBYyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBRXpFLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0lBQ3RDLElBQUksWUFBWSxHQUFHLElBQUkscUJBQVksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0lBRTdELElBQUksQ0FBQztRQUNILFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUVwQixNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDO1FBQ25ELElBQUksT0FBTyxHQUFHLElBQUks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QUFBLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxVQUFVLENBQUE7cUJBQ2xDO29CQUNELE9BQU8sRUFBRTt3QkFDUCxXQUFXLEVBQUUsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLE9BQU87cUJBQzdCO29CQUNELFFBQVEsRUFBRTt3QkFDUixXQUFXLEVBQUUsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLFFBQVE7cUJBQzlCO29CQUNELFdBQVcsRUFBRTt3QkFDWCxXQUFXLEVBQUUsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLFdBQVc7cUJBQ2pDO29CQUNELFlBQVksRUFBRTt3QkFDWixXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUEsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLGNBQWMsQ0FBQTtxQkFDdEM7b0JBQ0QsYUFBYSxFQUFFO3dCQUNiLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsb0JBQW9CLENBQUE7cUJBQzVDO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGLENBQUM7SUFFRixPQUFPLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDeEQsQ0FBQyxDQUFBO0FBN0NZLFFBQUEsMEJBQTBCLDhCQTZDdEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb250ZXh0LCBIYW5kbGVyIH0gZnJvbSBcImF3cy1sYW1iZGFcIjtcbmltcG9ydCB7IEtQQUhhbmRsZXIsIEtQQU9wdGlvbnMsIFdvcmtlclN0YXR1cyB9IGZyb20gXCIuLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy93b3JrZXJcIjtcbmltcG9ydCB7IFNwZWN0cnVtVXNlckpvYiB9IGZyb20gXCIuL2pvYlwiO1xuaW1wb3J0IHsgSm9iU3RhdHVzIH0gZnJvbSBcIi4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL2pvYlwiO1xuaW1wb3J0IHsgS1BBU3BlY3RydW1Db25maWd1cmF0aW9uREIgfSBmcm9tIFwiLi9tb25nb2RiXCI7XG5pbXBvcnQgeyBkZWJ1Z2xvZyB9IGZyb20gJ3V0aWwnO1xuXG4vLyBIYW5kbGVyXG5jb25zdCBleGVjID0gYXN5bmMgKGV2ZW50OiBhbnksIGNvbnRleHQ/OiBDb250ZXh0LCBrcGFPcHRpb25zPzpLUEFPcHRpb25zKSA9PiB7XG4gIGNvbnN0IGxvZ2dlciA9IGtwYU9wdGlvbnM/LmxvZ2dlciB8fCBjb25zb2xlLmxvZztcbiAgZGVidWdsb2coJ2xvZzp3b3JrZXI6c3BlY3RydW06dXNlcjplbnYnKSgnIyMgRU5WSVJPTk1FTlQgVkFSSUFCTEVTOiAnICsgc2VyaWFsaXplKHByb2Nlc3MuZW52KSlcbiAgZGVidWdsb2coJ2xvZzp3b3JrZXI6c3BlY3RydW06dXNlcicpKCcjIyBFVkVOVDogJyArIHNlcmlhbGl6ZShldmVudCkpXG4gIGRlYnVnbG9nKCdsb2c6d29ya2VyOnNwZWN0cnVtOnVzZXInKSgnIyMgQ09OVEVYVDogJyArIHNlcmlhbGl6ZShjb250ZXh0KSlcblxuICBsb2dnZXIoXCJFeGVjdXRlIFNwZWN0cnVtIFVzZXIgU3RhcnRcIik7XG4gIGxldCB3b3JrZXJTdGF0dXMgPSBuZXcgV29ya2VyU3RhdHVzKCdTcGVjdHJ1bSBVc2VyIEhhbmRsZXInKTtcblxuICB0cnkge1xuICAgIHdvcmtlclN0YXR1cy5zdGFydCgpXG5cbiAgICBjb25zdCByZWNvcmQgPSBldmVudC5SZWNvcmRzWzBdO1xuICAgIGNvbnN0IG1lc3NhZ2VBdHRyaWJ1dGVzID0gcmVjb3JkLm1lc3NhZ2VBdHRyaWJ1dGVzO1xuICAgIGxldCB1c2VySm9iID0gbmV3IFNwZWN0cnVtVXNlckpvYihtZXNzYWdlQXR0cmlidXRlcyk7XG4gICAgbGV0IGpvYlN0YXR1cyA9IG5ldyBKb2JTdGF0dXModXNlckpvYi5uYW1lKTtcbiAgICB3b3JrZXJTdGF0dXMuam9iTG9nLnB1c2goam9iU3RhdHVzKTtcblxuICAgIHRyeSB7XG4gICAgICBqb2JTdGF0dXMuc3RhcnQoKVxuICAgICAgYXdhaXQgdXNlckpvYi5leGVjdXRlKGpvYlN0YXR1cyk7XG4gICAgfSBjYXRjaCAoZTphbnkpIHtcbiAgICAgIGpvYlN0YXR1cy5lcnJvciA9IHtcbiAgICAgICAgbWVzc2FnZTogU3RyaW5nKGUpLFxuICAgICAgICBzdGFjazogZS5zdGFjayxcbiAgICAgIH07XG4gICAgICB0aHJvdyBlO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAgIGpvYlN0YXR1cy5kb25lKClcbiAgICB9XG5cbiAgfSBjYXRjaChlKSB7XG4gICAgd29ya2VyU3RhdHVzLmVycm9yID0gU3RyaW5nKGUpO1xuICAgIGxvZ2dlcihgV29ya2VyIFN0b3Agd2l0aCBVbmV4cGVjdGVkIEVycm9yIDogJHtlfWApO1xuICB9IGZpbmFsbHkge1xuICAgIHdvcmtlclN0YXR1cy5kb25lKClcbiAgfVxuXG4gIGxvZ2dlcihcIkV4ZWN1dGUgU3BlY3RydW0gVXNlciBEb25lXCIpO1xuXG4gIGNvbnN0IHJlc3BvbnNlID0ge1xuICAgIFwic3RhdHVzQ29kZVwiOiAyMDAsXG4gICAgXCJzb3VyY2VcIjogXCJTcGVjdHJ1bSBQcm9qZWN0IEludGVncmF0aW9uXCIsXG4gICAgXCJib2R5XCI6IHdvcmtlclN0YXR1cyxcbiAgfVxuXG4gIHJldHVybiByZXNwb25zZVxufVxuXG52YXIgc2VyaWFsaXplID0gZnVuY3Rpb24ob2JqZWN0OiBhbnkpIHtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iamVjdCwgbnVsbCwgMilcbn1cblxuZXhwb3J0IGNvbnN0IHNwZWN0cnVtVXNlckxhbWJkYUhhbmRsZXIgOiBIYW5kbGVyID0gYXN5bmMgKGV2ZW50OiBhbnksIGNvbnRleHQ6IENvbnRleHQpID0+IHtcbiAgcmV0dXJuIGV4ZWMoZXZlbnQsIGNvbnRleHQpO1xufVxuXG5leHBvcnQgY29uc3Qgc3BlY3RydW1Vc2VyU3luY0tQQUhhbmRsZXIgOiBLUEFIYW5kbGVyID0gYXN5bmMgKGV2ZW50OiBhbnksIGtwYU9wdGlvbnM6IEtQQU9wdGlvbnMpID0+IHtcbiAgY29uc3QgcmVjb3JkID0gZXZlbnQuUmVjb3Jkc1swXTtcbiAgY29uc3QgbWVzc2FnZUF0dHJpYnV0ZXMgPSByZWNvcmQubWVzc2FnZUF0dHJpYnV0ZXM7XG4gIGxldCBrcGFUb2tlbiA9IG1lc3NhZ2VBdHRyaWJ1dGVzWydrcGFUb2tlbiddWydzdHJpbmdWYWx1ZSddO1xuXG4gIGNvbnN0IGNvbmZpZ0RCID0gbmV3IEtQQVNwZWN0cnVtQ29uZmlndXJhdGlvbkRCKCk7XG4gIGxldCBjb25maWcgPSBhd2FpdCBjb25maWdEQi5nZXRDb25maWd1cmF0aW9uQnlLcGFUb2tlbihrcGFUb2tlbik7XG5cbiAgY29uc3QgbGFtYmRhUmVjb3JkUHJveHkgPSB7XG4gICAgUmVjb3JkczogW1xuICAgICAge1xuICAgICAgICBtZXNzYWdlQXR0cmlidXRlczoge1xuICAgICAgICAgIHNlcnZlclVybDoge1xuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IGAke2NvbmZpZz8uc3BlY3RydW1Vcmx9OiR7Y29uZmlnPy5zcGVjdHJ1bVBvcnR9YFxuICAgICAgICAgIH0sXG4gICAgICAgICAgY29tcGFueUNvZGVzOiB7XG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogSlNPTi5zdHJpbmdpZnkoY29uZmlnPy5jb21wYW55Q29kZXMpXG4gICAgICAgICAgfSxcbiAgICAgICAgICBhdXRob3JpemF0aW9uSWQ6IHtcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiBjb25maWc/LmF1dGhvcml6YXRpb25JZFxuICAgICAgICAgIH0sXG4gICAgICAgICAgaXNFZGl0VXNlcjoge1xuICAgICAgICAgICAgc3RyaW5nVmFsdWU6ICEhY29uZmlnPy5pc0VkaXRVc2VyLFxuICAgICAgICAgIH0sXG4gICAgICAgICAga3BhU2l0ZToge1xuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IGNvbmZpZz8ua3BhU2l0ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAga3BhVG9rZW46IHtcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiBjb25maWc/LmtwYVRva2VuXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkZWZhdWx0Um9sZToge1xuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IGNvbmZpZz8uZGVmYXVsdFJvbGUsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB3ZWxjb21lRW1haWw6IHtcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiAhIWNvbmZpZz8uaXNXZWxjb21lRW1haWwsXG4gICAgICAgICAgfSxcbiAgICAgICAgICByZXNldFBhc3N3b3JkOiB7XG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogISFjb25maWc/LmlzRm9yY2VSZXNldFBhc3N3b3JkLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIF0sXG4gIH07XG5cbiAgcmV0dXJuIGV4ZWMobGFtYmRhUmVjb3JkUHJveHksIHVuZGVmaW5lZCwga3BhT3B0aW9ucyk7XG59XG4iXX0=