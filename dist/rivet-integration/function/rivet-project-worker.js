"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rivetProjectSyncKPAHandler = exports.rivetProjectLambdaHandler = void 0;
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
    logger("Execute Rivet Project Start");
    let workerStatus = new worker_1.WorkerStatus('Rivet Project Handler');
    try {
        workerStatus.start();
        const record = event.Records[0];
        const messageAttributes = record.messageAttributes;
        let projectJob = new job_1.RivetProjectJob(messageAttributes);
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
    logger("Execute Rivet Project Done");
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
const rivetProjectLambdaHandler = async (event, context) => {
    return exec(event, context);
};
exports.rivetProjectLambdaHandler = rivetProjectLambdaHandler;
const rivetProjectSyncKPAHandler = async (event, kpaOptions) => {
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
exports.rivetProjectSyncKPAHandler = rivetProjectSyncKPAHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicml2ZXQtcHJvamVjdC13b3JrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9yaXZldC1pbnRlZ3JhdGlvbi9mdW5jdGlvbi9yaXZldC1wcm9qZWN0LXdvcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwrQkFBd0M7QUFDeEMsd0RBQTJEO0FBQzNELDhEQUF5RjtBQUN6Rix1Q0FBb0Q7QUFDcEQsK0JBQWdDO0FBRWhDLFVBQVU7QUFDVixNQUFNLElBQUksR0FBRyxLQUFLLEVBQUUsS0FBVSxFQUFFLE9BQWlCLEVBQUUsVUFBc0IsRUFBRSxFQUFFO0lBQzNFLE1BQU0sTUFBTSxHQUFHLENBQUEsVUFBVSxhQUFWLFVBQVUsdUJBQVYsVUFBVSxDQUFFLE1BQU0sS0FBSSxPQUFPLENBQUMsR0FBRyxDQUFDO0lBQ2pELElBQUEsZUFBUSxFQUFDLDRCQUE0QixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtJQUMvRCxJQUFBLGVBQVEsRUFBQyxZQUFZLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7SUFDekMsSUFBQSxlQUFRLEVBQUMsY0FBYyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBRTdDLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0lBQ3RDLElBQUksWUFBWSxHQUFHLElBQUkscUJBQVksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0lBRTdELElBQUksQ0FBQztRQUNILFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUVwQixNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDO1FBQ25ELElBQUksVUFBVSxHQUFHLElBQUkscUJBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3hELElBQUksU0FBUyxHQUFHLElBQUks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TUFBTSxDQUFFLFFBQVE7cUJBQzlCO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGLENBQUM7SUFFRixPQUFPLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDeEQsQ0FBQyxDQUFBO0FBbENZLFFBQUEsMEJBQTBCLDhCQWtDdEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb250ZXh0LCBIYW5kbGVyIH0gZnJvbSBcImF3cy1sYW1iZGFcIjtcbmltcG9ydCB7IFJpdmV0UHJvamVjdEpvYiB9IGZyb20gXCIuL2pvYlwiO1xuaW1wb3J0IHsgSm9iU3RhdHVzIH0gZnJvbSBcIi4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL2pvYlwiO1xuaW1wb3J0IHsgS1BBSGFuZGxlciwgS1BBT3B0aW9ucywgV29ya2VyU3RhdHVzIH0gZnJvbSBcIi4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL3dvcmtlclwiO1xuaW1wb3J0IHsgS1BBUml2ZXRDb25maWd1cmF0aW9uREIgfSBmcm9tIFwiLi9tb25nb2RiXCI7XG5pbXBvcnQgeyBkZWJ1Z2xvZyB9IGZyb20gJ3V0aWwnO1xuXG4vLyBIYW5kbGVyXG5jb25zdCBleGVjID0gYXN5bmMgKGV2ZW50OiBhbnksIGNvbnRleHQ/OiBDb250ZXh0LCBrcGFPcHRpb25zPzpLUEFPcHRpb25zKSA9PiB7XG4gIGNvbnN0IGxvZ2dlciA9IGtwYU9wdGlvbnM/LmxvZ2dlciB8fCBjb25zb2xlLmxvZztcbiAgZGVidWdsb2coJyMjIEVOVklST05NRU5UIFZBUklBQkxFUzogJyArIHNlcmlhbGl6ZShwcm9jZXNzLmVudikpXG4gIGRlYnVnbG9nKCcjIyBFVkVOVDogJyArIHNlcmlhbGl6ZShldmVudCkpXG4gIGRlYnVnbG9nKCcjIyBDT05URVhUOiAnICsgc2VyaWFsaXplKGNvbnRleHQpKVxuXG4gIGxvZ2dlcihcIkV4ZWN1dGUgUml2ZXQgUHJvamVjdCBTdGFydFwiKTtcbiAgbGV0IHdvcmtlclN0YXR1cyA9IG5ldyBXb3JrZXJTdGF0dXMoJ1JpdmV0IFByb2plY3QgSGFuZGxlcicpO1xuXG4gIHRyeSB7XG4gICAgd29ya2VyU3RhdHVzLnN0YXJ0KClcblxuICAgIGNvbnN0IHJlY29yZCA9IGV2ZW50LlJlY29yZHNbMF07XG4gICAgY29uc3QgbWVzc2FnZUF0dHJpYnV0ZXMgPSByZWNvcmQubWVzc2FnZUF0dHJpYnV0ZXM7XG4gICAgbGV0IHByb2plY3RKb2IgPSBuZXcgUml2ZXRQcm9qZWN0Sm9iKG1lc3NhZ2VBdHRyaWJ1dGVzKTtcbiAgICBsZXQgam9iU3RhdHVzID0gbmV3IEpvYlN0YXR1cyhwcm9qZWN0Sm9iLm5hbWUpO1xuICAgIHdvcmtlclN0YXR1cy5qb2JMb2cucHVzaChqb2JTdGF0dXMpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGpvYlN0YXR1cy5zdGFydCgpXG4gICAgICBhd2FpdCBwcm9qZWN0Sm9iLmV4ZWN1dGUoam9iU3RhdHVzKTtcbiAgICB9IGNhdGNoIChlOmFueSkge1xuICAgICAgam9iU3RhdHVzLmVycm9yID0ge1xuICAgICAgICBtZXNzYWdlOiBTdHJpbmcoZSksXG4gICAgICAgIHN0YWNrOiBlLnN0YWNrLFxuICAgICAgfVxuICAgICAgdGhyb3cgZTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICBqb2JTdGF0dXMuZG9uZSgpXG4gICAgfVxuXG4gIH0gY2F0Y2goZSkge1xuICAgIHdvcmtlclN0YXR1cy5lcnJvciA9IFN0cmluZyhlKTtcbiAgICBsb2dnZXIoYFdvcmtlciBTdG9wIHdpdGggVW5leHBlY3RlZCBFcnJvciA6ICR7ZX1gKTtcbiAgfSBmaW5hbGx5IHtcbiAgICB3b3JrZXJTdGF0dXMuZG9uZSgpXG4gIH1cblxuICBsb2dnZXIoXCJFeGVjdXRlIFJpdmV0IFByb2plY3QgRG9uZVwiKTtcblxuICBjb25zdCByZXNwb25zZSA9IHtcbiAgICBcInN0YXR1c0NvZGVcIjogMjAwLFxuICAgIFwic291cmNlXCI6IFwiUml2ZXQgUHJvamVjdCBJbnRlZ3JhdGlvblwiLFxuICAgIFwiYm9keVwiOiB3b3JrZXJTdGF0dXMsXG4gIH1cblxuICByZXR1cm4gcmVzcG9uc2Vcbn1cblxudmFyIHNlcmlhbGl6ZSA9IGZ1bmN0aW9uKG9iamVjdDogYW55KSB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmplY3QsIG51bGwsIDIpXG59XG5cbmV4cG9ydCBjb25zdCByaXZldFByb2plY3RMYW1iZGFIYW5kbGVyIDogSGFuZGxlciA9IGFzeW5jIChldmVudDogYW55LCBjb250ZXh0OiBDb250ZXh0KSA9PiB7XG4gIHJldHVybiBleGVjKGV2ZW50LCBjb250ZXh0KTtcbn1cblxuZXhwb3J0IGNvbnN0IHJpdmV0UHJvamVjdFN5bmNLUEFIYW5kbGVyIDogS1BBSGFuZGxlciA9IGFzeW5jIChldmVudDogYW55LCBrcGFPcHRpb25zOiBLUEFPcHRpb25zKSA9PiB7XG5cbiAgY29uc3QgcmVjb3JkID0gZXZlbnQuUmVjb3Jkc1swXTtcbiAgY29uc3QgbWVzc2FnZUF0dHJpYnV0ZXMgPSByZWNvcmQubWVzc2FnZUF0dHJpYnV0ZXM7XG4gIGxldCBrcGFUb2tlbiA9IG1lc3NhZ2VBdHRyaWJ1dGVzWydrcGFUb2tlbiddWydzdHJpbmdWYWx1ZSddO1xuXG4gIGNvbnN0IGNvbmZpZ0RCID0gbmV3IEtQQVJpdmV0Q29uZmlndXJhdGlvbkRCKCk7XG4gIGxldCBjb25maWcgPSBhd2FpdCBjb25maWdEQi5nZXRDb25maWd1cmF0aW9uQnlLcGFUb2tlbihrcGFUb2tlbik7XG5cbiAgY29uc3QgbGFtYmRhUmVjb3JkUHJveHkgPSB7XG4gICAgUmVjb3JkczogW1xuICAgICAge1xuICAgICAgICBtZXNzYWdlQXR0cmlidXRlczoge1xuICAgICAgICAgIGNsaWVudElkOiB7XG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogY29uZmlnPy5jbGllbnRJZFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdG9rZW46IHtcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiBjb25maWc/LnRva2VuXG4gICAgICAgICAgfSxcbiAgICAgICAgICBpc0VkaXRQcm9qZWN0OiB7XG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogY29uZmlnPy5pc0VkaXRQcm9qZWN0ID8gJzEnIDogJzAnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAga3BhU2l0ZToge1xuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IGNvbmZpZz8ua3BhU2l0ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAga3BhVG9rZW46IHtcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiBjb25maWc/LmtwYVRva2VuXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfTtcblxuICByZXR1cm4gZXhlYyhsYW1iZGFSZWNvcmRQcm94eSwgdW5kZWZpbmVkLCBrcGFPcHRpb25zKTtcbn1cbiJdfQ==