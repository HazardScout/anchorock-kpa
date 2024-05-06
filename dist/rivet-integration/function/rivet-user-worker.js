"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rivetUserSyncKPAHandler = exports.rivetUserLambdaHandler = void 0;
const worker_1 = require("../../base-integration/src/worker");
const job_1 = require("./job");
const job_2 = require("../../base-integration/src/job");
const mongodb_1 = require("./mongodb");
const util_1 = require("util");
// Handler
const exec = async (event, context, kpaOptions) => {
    const logger = (kpaOptions === null || kpaOptions === void 0 ? void 0 : kpaOptions.logger) || console.log;
    (0, util_1.debuglog)('log:worker:rivet:user:env')('## ENVIRONMENT VARIABLES: ' + serialize(process.env));
    (0, util_1.debuglog)('log:worker:rivet:user')('## EVENT: ' + serialize(event));
    (0, util_1.debuglog)('log:worker:rivet:user')('## CONTEXT: ' + serialize(context));
    logger("Execute Rivet User Start");
    let workerStatus = new worker_1.WorkerStatus('Rivet User Handler');
    try {
        workerStatus.start();
        const record = event.Records[0];
        const messageAttributes = record.messageAttributes;
        let userJob = new job_1.RivetUserJob(messageAttributes);
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
    logger("Execute Rovet User Done");
    const response = {
        "statusCode": 200,
        "source": "Rivet Project Integration",
        "body": workerStatus,
    };
    return response;
};
var serialize = function (object) {
    return JSON.stringify(object, null, 2);
};
const rivetUserLambdaHandler = async (event, context) => {
    return exec(event, context);
};
exports.rivetUserLambdaHandler = rivetUserLambdaHandler;
const rivetUserSyncKPAHandler = async (event, kpaOptions) => {
    const record = event.Records[0];
    const messageAttributes = record.messageAttributes;
    let kpaToken = messageAttributes['kpaToken']['stringValue'];
    const configDB = new mongodb_1.KPARivetConfigurationDB();
    let config = await configDB.getConfigurationByKpaToken(kpaToken);
    const lambdaRecordProxy = {
        Records: [
            {
                messageAttributes: {
                    clientId: {
                        stringValue: config === null || config === void 0 ? void 0 : config.clientId
                    },
                    token: {
                        stringValue: config === null || config === void 0 ? void 0 : config.token
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
exports.rivetUserSyncKPAHandler = rivetUserSyncKPAHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicml2ZXQtdXNlci13b3JrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9yaXZldC1pbnRlZ3JhdGlvbi9mdW5jdGlvbi9yaXZldC11c2VyLXdvcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw4REFBeUY7QUFDekYsK0JBQXFDO0FBQ3JDLHdEQUEyRDtBQUMzRCx1Q0FBb0Q7QUFDcEQsK0JBQWdDO0FBRWhDLFVBQVU7QUFDVixNQUFNLElBQUksR0FBRyxLQUFLLEVBQUUsS0FBVSxFQUFFLE9BQWlCLEVBQUUsVUFBc0IsRUFBRSxFQUFFO0lBQzNFLE1BQU0sTUFBTSxHQUFHLENBQUEsVUFBVSxhQUFWLFVBQVUsdUJBQVYsVUFBVSxDQUFFLE1BQU0sS0FBSSxPQUFPLENBQUMsR0FBRyxDQUFDO0lBQ2pELElBQUEsZUFBUSxFQUFDLDJCQUEyQixDQUFDLENBQUMsNEJBQTRCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO0lBQzVGLElBQUEsZUFBUSxFQUFDLHVCQUF1QixDQUFDLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFBO0lBQ2xFLElBQUEsZUFBUSxFQUFDLHVCQUF1QixDQUFDLENBQUMsY0FBYyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBRXRFLE1BQU0sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0lBQ25DLElBQUksWUFBWSxHQUFHLElBQUkscUJBQVksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBRTFELElBQUksQ0FBQztRQUNILFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUVwQixNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDO1FBQ25ELElBQUksT0FBTyxHQUFHLElBQUksa0JBQVksQ0FB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QUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsUUFBUTtxQkFDOUI7b0JBQ0QsV0FBVyxFQUFFO3dCQUNYLFdBQVcsRUFBRSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsV0FBVztxQkFDakM7b0JBQ0QsWUFBWSxFQUFFO3dCQUNaLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsY0FBYyxDQUFBO3FCQUN0QztvQkFDRCxhQUFhLEVBQUU7d0JBQ2IsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFBLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxvQkFBb0IsQ0FBQTtxQkFDNUM7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQztJQUVGLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN4RCxDQUFDLENBQUE7QUExQ1ksUUFBQSx1QkFBdUIsMkJBMENuQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnRleHQsIEhhbmRsZXIgfSBmcm9tIFwiYXdzLWxhbWJkYVwiO1xuaW1wb3J0IHsgS1BBSGFuZGxlciwgS1BBT3B0aW9ucywgV29ya2VyU3RhdHVzIH0gZnJvbSBcIi4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL3dvcmtlclwiO1xuaW1wb3J0IHsgUml2ZXRVc2VySm9iIH0gZnJvbSBcIi4vam9iXCI7XG5pbXBvcnQgeyBKb2JTdGF0dXMgfSBmcm9tIFwiLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvam9iXCI7XG5pbXBvcnQgeyBLUEFSaXZldENvbmZpZ3VyYXRpb25EQiB9IGZyb20gXCIuL21vbmdvZGJcIjtcbmltcG9ydCB7IGRlYnVnbG9nIH0gZnJvbSAndXRpbCc7XG5cbi8vIEhhbmRsZXJcbmNvbnN0IGV4ZWMgPSBhc3luYyAoZXZlbnQ6IGFueSwgY29udGV4dD86IENvbnRleHQsIGtwYU9wdGlvbnM/OktQQU9wdGlvbnMpID0+IHtcbiAgY29uc3QgbG9nZ2VyID0ga3BhT3B0aW9ucz8ubG9nZ2VyIHx8IGNvbnNvbGUubG9nO1xuICBkZWJ1Z2xvZygnbG9nOndvcmtlcjpyaXZldDp1c2VyOmVudicpKCcjIyBFTlZJUk9OTUVOVCBWQVJJQUJMRVM6ICcgKyBzZXJpYWxpemUocHJvY2Vzcy5lbnYpKVxuICBkZWJ1Z2xvZygnbG9nOndvcmtlcjpyaXZldDp1c2VyJykoJyMjIEVWRU5UOiAnICsgc2VyaWFsaXplKGV2ZW50KSlcbiAgZGVidWdsb2coJ2xvZzp3b3JrZXI6cml2ZXQ6dXNlcicpKCcjIyBDT05URVhUOiAnICsgc2VyaWFsaXplKGNvbnRleHQpKVxuXG4gIGxvZ2dlcihcIkV4ZWN1dGUgUml2ZXQgVXNlciBTdGFydFwiKTtcbiAgbGV0IHdvcmtlclN0YXR1cyA9IG5ldyBXb3JrZXJTdGF0dXMoJ1JpdmV0IFVzZXIgSGFuZGxlcicpO1xuXG4gIHRyeSB7XG4gICAgd29ya2VyU3RhdHVzLnN0YXJ0KClcblxuICAgIGNvbnN0IHJlY29yZCA9IGV2ZW50LlJlY29yZHNbMF07XG4gICAgY29uc3QgbWVzc2FnZUF0dHJpYnV0ZXMgPSByZWNvcmQubWVzc2FnZUF0dHJpYnV0ZXM7XG4gICAgbGV0IHVzZXJKb2IgPSBuZXcgUml2ZXRVc2VySm9iKG1lc3NhZ2VBdHRyaWJ1dGVzKTtcbiAgICBsZXQgam9iU3RhdHVzID0gbmV3IEpvYlN0YXR1cyh1c2VySm9iLm5hbWUpO1xuICAgIHdvcmtlclN0YXR1cy5qb2JMb2cucHVzaChqb2JTdGF0dXMpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGpvYlN0YXR1cy5zdGFydCgpXG4gICAgICBhd2FpdCB1c2VySm9iLmV4ZWN1dGUoam9iU3RhdHVzKTtcbiAgICB9IGNhdGNoIChlOmFueSkge1xuICAgICAgICBqb2JTdGF0dXMuZXJyb3IgPSB7XG4gICAgICAgICAgbWVzc2FnZTogU3RyaW5nKGUpLFxuICAgICAgICAgIHN0YWNrOiBlLnN0YWNrLFxuICAgICAgICB9XG4gICAgICAgIHRocm93IGU7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgam9iU3RhdHVzLmRvbmUoKVxuICAgIH1cblxuICB9IGNhdGNoKGUpIHtcbiAgICB3b3JrZXJTdGF0dXMuZXJyb3IgPSBTdHJpbmcoZSk7XG4gICAgbG9nZ2VyKGBXb3JrZXIgU3RvcCB3aXRoIFVuZXhwZWN0ZWQgRXJyb3IgOiAke2V9YCk7XG4gIH0gZmluYWxseSB7XG4gICAgd29ya2VyU3RhdHVzLmRvbmUoKVxuICB9XG5cbiAgbG9nZ2VyKFwiRXhlY3V0ZSBSb3ZldCBVc2VyIERvbmVcIik7XG5cbiAgY29uc3QgcmVzcG9uc2UgPSB7XG4gICAgXCJzdGF0dXNDb2RlXCI6IDIwMCxcbiAgICBcInNvdXJjZVwiOiBcIlJpdmV0IFByb2plY3QgSW50ZWdyYXRpb25cIixcbiAgICBcImJvZHlcIjogd29ya2VyU3RhdHVzLFxuICB9XG5cbiAgcmV0dXJuIHJlc3BvbnNlXG59XG5cbnZhciBzZXJpYWxpemUgPSBmdW5jdGlvbihvYmplY3Q6IGFueSkge1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqZWN0LCBudWxsLCAyKVxufVxuXG5leHBvcnQgY29uc3Qgcml2ZXRVc2VyTGFtYmRhSGFuZGxlciA6IEhhbmRsZXIgPSBhc3luYyAoZXZlbnQ6IGFueSwgY29udGV4dDogQ29udGV4dCkgPT4ge1xuICByZXR1cm4gZXhlYyhldmVudCwgY29udGV4dCk7XG59XG5cbmV4cG9ydCBjb25zdCByaXZldFVzZXJTeW5jS1BBSGFuZGxlciA6IEtQQUhhbmRsZXIgPSBhc3luYyAoZXZlbnQ6IGFueSwga3BhT3B0aW9uczogS1BBT3B0aW9ucykgPT4ge1xuICBjb25zdCByZWNvcmQgPSBldmVudC5SZWNvcmRzWzBdO1xuICBjb25zdCBtZXNzYWdlQXR0cmlidXRlcyA9IHJlY29yZC5tZXNzYWdlQXR0cmlidXRlcztcbiAgbGV0IGtwYVRva2VuID0gbWVzc2FnZUF0dHJpYnV0ZXNbJ2twYVRva2VuJ11bJ3N0cmluZ1ZhbHVlJ107XG5cbiAgY29uc3QgY29uZmlnREIgPSBuZXcgS1BBUml2ZXRDb25maWd1cmF0aW9uREIoKTtcbiAgbGV0IGNvbmZpZyA9IGF3YWl0IGNvbmZpZ0RCLmdldENvbmZpZ3VyYXRpb25CeUtwYVRva2VuKGtwYVRva2VuKTtcblxuICBjb25zdCBsYW1iZGFSZWNvcmRQcm94eSA9IHtcbiAgICBSZWNvcmRzOiBbXG4gICAgICB7XG4gICAgICAgIG1lc3NhZ2VBdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgY2xpZW50SWQ6IHtcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiBjb25maWc/LmNsaWVudElkXG4gICAgICAgICAgfSxcbiAgICAgICAgICB0b2tlbjoge1xuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IGNvbmZpZz8udG9rZW5cbiAgICAgICAgICB9LFxuICAgICAgICAgIGlzRWRpdFVzZXI6IHtcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiAhIWNvbmZpZz8uaXNFZGl0VXNlcixcbiAgICAgICAgICB9LFxuICAgICAgICAgIGtwYVNpdGU6IHtcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiBjb25maWc/LmtwYVNpdGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIGtwYVRva2VuOiB7XG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogY29uZmlnPy5rcGFUb2tlblxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGVmYXVsdFJvbGU6IHtcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiBjb25maWc/LmRlZmF1bHRSb2xlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgd2VsY29tZUVtYWlsOiB7XG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogISFjb25maWc/LmlzV2VsY29tZUVtYWlsLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVzZXRQYXNzd29yZDoge1xuICAgICAgICAgICAgc3RyaW5nVmFsdWU6ICEhY29uZmlnPy5pc0ZvcmNlUmVzZXRQYXNzd29yZCxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdLFxuICB9O1xuXG4gIHJldHVybiBleGVjKGxhbWJkYVJlY29yZFByb3h5LCB1bmRlZmluZWQsIGtwYU9wdGlvbnMpO1xufVxuIl19