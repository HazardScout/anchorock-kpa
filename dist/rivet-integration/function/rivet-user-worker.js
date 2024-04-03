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
    (0, util_1.debuglog)('## ENVIRONMENT VARIABLES: ' + serialize(process.env));
    (0, util_1.debuglog)('## EVENT: ' + serialize(event));
    (0, util_1.debuglog)('## CONTEXT: ' + serialize(context));
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
exports.rivetUserSyncKPAHandler = rivetUserSyncKPAHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicml2ZXQtdXNlci13b3JrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9yaXZldC1pbnRlZ3JhdGlvbi9mdW5jdGlvbi9yaXZldC11c2VyLXdvcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw4REFBeUY7QUFDekYsK0JBQXFDO0FBQ3JDLHdEQUEyRDtBQUMzRCx1Q0FBb0Q7QUFDcEQsK0JBQWdDO0FBRWhDLFVBQVU7QUFDVixNQUFNLElBQUksR0FBRyxLQUFLLEVBQUUsS0FBVSxFQUFFLE9BQWlCLEVBQUUsVUFBc0IsRUFBRSxFQUFFO0lBQzNFLE1BQU0sTUFBTSxHQUFHLENBQUEsVUFBVSxhQUFWLFVBQVUsdUJBQVYsVUFBVSxDQUFFLE1BQU0sS0FBSSxPQUFPLENBQUMsR0FBRyxDQUFDO0lBQ2pELElBQUEsZUFBUSxFQUFDLDRCQUE0QixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtJQUMvRCxJQUFBLGVBQVEsRUFBQyxZQUFZLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7SUFDekMsSUFBQSxlQUFRLEVBQUMsY0FBYyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBRTdDLE1BQU0sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0lBQ25DLElBQUksWUFBWSxHQUFHLElBQUkscUJBQVksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBRTFELElBQUksQ0FBQztRQUNILFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUVwQixNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDO1FBQ25ELElBQUksT0FBTyxHQUFHLElBQUksa0JBQVksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ2xELElBQUksU0FBUyxHQUFHLElBQUksZUFBUyxD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QUFFLFFBQVE7cUJBQzlCO29CQUNELFdBQVcsRUFBRTt3QkFDWCxXQUFXLEVBQUUsQ0FBQSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsV0FBVyxFQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUc7cUJBQzdDO29CQUNELFlBQVksRUFBRTt3QkFDWixXQUFXLEVBQUUsQ0FBQSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsY0FBYyxFQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUc7cUJBQ2hEO29CQUNELGFBQWEsRUFBRTt3QkFDYixXQUFXLEVBQUUsQ0FBQSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsb0JBQW9CLEVBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRztxQkFDdEQ7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQztJQUVGLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN4RCxDQUFDLENBQUE7QUExQ1ksUUFBQSx1QkFBdUIsMkJBMENuQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnRleHQsIEhhbmRsZXIgfSBmcm9tIFwiYXdzLWxhbWJkYVwiO1xuaW1wb3J0IHsgS1BBSGFuZGxlciwgS1BBT3B0aW9ucywgV29ya2VyU3RhdHVzIH0gZnJvbSBcIi4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL3dvcmtlclwiO1xuaW1wb3J0IHsgUml2ZXRVc2VySm9iIH0gZnJvbSBcIi4vam9iXCI7XG5pbXBvcnQgeyBKb2JTdGF0dXMgfSBmcm9tIFwiLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvam9iXCI7XG5pbXBvcnQgeyBLUEFSaXZldENvbmZpZ3VyYXRpb25EQiB9IGZyb20gXCIuL21vbmdvZGJcIjtcbmltcG9ydCB7IGRlYnVnbG9nIH0gZnJvbSAndXRpbCc7XG5cbi8vIEhhbmRsZXJcbmNvbnN0IGV4ZWMgPSBhc3luYyAoZXZlbnQ6IGFueSwgY29udGV4dD86IENvbnRleHQsIGtwYU9wdGlvbnM/OktQQU9wdGlvbnMpID0+IHtcbiAgY29uc3QgbG9nZ2VyID0ga3BhT3B0aW9ucz8ubG9nZ2VyIHx8IGNvbnNvbGUubG9nO1xuICBkZWJ1Z2xvZygnIyMgRU5WSVJPTk1FTlQgVkFSSUFCTEVTOiAnICsgc2VyaWFsaXplKHByb2Nlc3MuZW52KSlcbiAgZGVidWdsb2coJyMjIEVWRU5UOiAnICsgc2VyaWFsaXplKGV2ZW50KSlcbiAgZGVidWdsb2coJyMjIENPTlRFWFQ6ICcgKyBzZXJpYWxpemUoY29udGV4dCkpXG5cbiAgbG9nZ2VyKFwiRXhlY3V0ZSBSaXZldCBVc2VyIFN0YXJ0XCIpO1xuICBsZXQgd29ya2VyU3RhdHVzID0gbmV3IFdvcmtlclN0YXR1cygnUml2ZXQgVXNlciBIYW5kbGVyJyk7XG5cbiAgdHJ5IHtcbiAgICB3b3JrZXJTdGF0dXMuc3RhcnQoKVxuXG4gICAgY29uc3QgcmVjb3JkID0gZXZlbnQuUmVjb3Jkc1swXTtcbiAgICBjb25zdCBtZXNzYWdlQXR0cmlidXRlcyA9IHJlY29yZC5tZXNzYWdlQXR0cmlidXRlcztcbiAgICBsZXQgdXNlckpvYiA9IG5ldyBSaXZldFVzZXJKb2IobWVzc2FnZUF0dHJpYnV0ZXMpO1xuICAgIGxldCBqb2JTdGF0dXMgPSBuZXcgSm9iU3RhdHVzKHVzZXJKb2IubmFtZSk7XG4gICAgd29ya2VyU3RhdHVzLmpvYkxvZy5wdXNoKGpvYlN0YXR1cyk7XG5cbiAgICB0cnkge1xuICAgICAgam9iU3RhdHVzLnN0YXJ0KClcbiAgICAgIGF3YWl0IHVzZXJKb2IuZXhlY3V0ZShqb2JTdGF0dXMpO1xuICAgIH0gY2F0Y2ggKGU6YW55KSB7XG4gICAgICAgIGpvYlN0YXR1cy5lcnJvciA9IHtcbiAgICAgICAgICBtZXNzYWdlOiBTdHJpbmcoZSksXG4gICAgICAgICAgc3RhY2s6IGUuc3RhY2ssXG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgZTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICBqb2JTdGF0dXMuZG9uZSgpXG4gICAgfVxuXG4gIH0gY2F0Y2goZSkge1xuICAgIHdvcmtlclN0YXR1cy5lcnJvciA9IFN0cmluZyhlKTtcbiAgICBsb2dnZXIoYFdvcmtlciBTdG9wIHdpdGggVW5leHBlY3RlZCBFcnJvciA6ICR7ZX1gKTtcbiAgfSBmaW5hbGx5IHtcbiAgICB3b3JrZXJTdGF0dXMuZG9uZSgpXG4gIH1cblxuICBsb2dnZXIoXCJFeGVjdXRlIFJvdmV0IFVzZXIgRG9uZVwiKTtcblxuICBjb25zdCByZXNwb25zZSA9IHtcbiAgICBcInN0YXR1c0NvZGVcIjogMjAwLFxuICAgIFwic291cmNlXCI6IFwiUml2ZXQgUHJvamVjdCBJbnRlZ3JhdGlvblwiLFxuICAgIFwiYm9keVwiOiB3b3JrZXJTdGF0dXMsXG4gIH1cblxuICByZXR1cm4gcmVzcG9uc2Vcbn1cblxudmFyIHNlcmlhbGl6ZSA9IGZ1bmN0aW9uKG9iamVjdDogYW55KSB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmplY3QsIG51bGwsIDIpXG59XG5cbmV4cG9ydCBjb25zdCByaXZldFVzZXJMYW1iZGFIYW5kbGVyIDogSGFuZGxlciA9IGFzeW5jIChldmVudDogYW55LCBjb250ZXh0OiBDb250ZXh0KSA9PiB7XG4gIHJldHVybiBleGVjKGV2ZW50LCBjb250ZXh0KTtcbn1cblxuZXhwb3J0IGNvbnN0IHJpdmV0VXNlclN5bmNLUEFIYW5kbGVyIDogS1BBSGFuZGxlciA9IGFzeW5jIChldmVudDogYW55LCBrcGFPcHRpb25zOiBLUEFPcHRpb25zKSA9PiB7XG4gIGNvbnN0IHJlY29yZCA9IGV2ZW50LlJlY29yZHNbMF07XG4gIGNvbnN0IG1lc3NhZ2VBdHRyaWJ1dGVzID0gcmVjb3JkLm1lc3NhZ2VBdHRyaWJ1dGVzO1xuICBsZXQga3BhVG9rZW4gPSBtZXNzYWdlQXR0cmlidXRlc1sna3BhVG9rZW4nXVsnc3RyaW5nVmFsdWUnXTtcblxuICBjb25zdCBjb25maWdEQiA9IG5ldyBLUEFSaXZldENvbmZpZ3VyYXRpb25EQigpO1xuICBsZXQgY29uZmlnID0gYXdhaXQgY29uZmlnREIuZ2V0Q29uZmlndXJhdGlvbkJ5S3BhVG9rZW4oa3BhVG9rZW4pO1xuXG4gIGNvbnN0IGxhbWJkYVJlY29yZFByb3h5ID0ge1xuICAgIFJlY29yZHM6IFtcbiAgICAgIHtcbiAgICAgICAgbWVzc2FnZUF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBjbGllbnRJZDoge1xuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IGNvbmZpZz8uY2xpZW50SWRcbiAgICAgICAgICB9LFxuICAgICAgICAgIHRva2VuOiB7XG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogY29uZmlnPy50b2tlblxuICAgICAgICAgIH0sXG4gICAgICAgICAgaXNFZGl0VXNlcjoge1xuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IGNvbmZpZz8uaXNFZGl0VXNlciA/ICcxJyA6ICcwJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGtwYVNpdGU6IHtcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiBjb25maWc/LmtwYVNpdGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIGtwYVRva2VuOiB7XG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogY29uZmlnPy5rcGFUb2tlblxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGVmYXVsdFJvbGU6IHtcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiBjb25maWc/LmRlZmF1bHRSb2xlID8gJzEnIDogJzAnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgd2VsY29tZUVtYWlsOiB7XG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogY29uZmlnPy5pc1dlbGNvbWVFbWFpbCA/ICcxJyA6ICcwJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlc2V0UGFzc3dvcmQ6IHtcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiBjb25maWc/LmlzRm9yY2VSZXNldFBhc3N3b3JkID8gJzEnIDogJzAnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIF0sXG4gIH07XG5cbiAgcmV0dXJuIGV4ZWMobGFtYmRhUmVjb3JkUHJveHksIHVuZGVmaW5lZCwga3BhT3B0aW9ucyk7XG59XG4iXX0=