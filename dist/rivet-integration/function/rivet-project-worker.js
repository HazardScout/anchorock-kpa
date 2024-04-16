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
    (0, util_1.debuglog)('log:worker:rivet:project:env')('## ENVIRONMENT VARIABLES: ' + serialize(process.env));
    (0, util_1.debuglog)('log:worker:rivet:project')('## EVENT: ' + serialize(event));
    (0, util_1.debuglog)('log:worker:rivet:project')('## CONTEXT: ' + serialize(context));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicml2ZXQtcHJvamVjdC13b3JrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9yaXZldC1pbnRlZ3JhdGlvbi9mdW5jdGlvbi9yaXZldC1wcm9qZWN0LXdvcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwrQkFBd0M7QUFDeEMsd0RBQTJEO0FBQzNELDhEQUF5RjtBQUN6Rix1Q0FBb0Q7QUFDcEQsK0JBQWdDO0FBRWhDLFVBQVU7QUFDVixNQUFNLElBQUksR0FBRyxLQUFLLEVBQUUsS0FBVSxFQUFFLE9BQWlCLEVBQUUsVUFBc0IsRUFBRSxFQUFFO0lBQzNFLE1BQU0sTUFBTSxHQUFHLENBQUEsVUFBVSxhQUFWLFVBQVUsdUJBQVYsVUFBVSxDQUFFLE1BQU0sS0FBSSxPQUFPLENBQUMsR0FBRyxDQUFDO0lBQ2pELElBQUEsZUFBUSxFQUFDLDhCQUE4QixDQUFDLENBQUMsNEJBQTRCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO0lBQy9GLElBQUEsZUFBUSxFQUFDLDBCQUEwQixDQUFDLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFBO0lBQ3JFLElBQUEsZUFBUSxFQUFDLDBCQUEwQixDQUFDLENBQUMsY0FBYyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBRXpFLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0lBQ3RDLElBQUksWUFBWSxHQUFHLElBQUkscUJBQVksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0lBRTdELElBQUksQ0FBQztRQUNILFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUVwQixNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDO1FBQ25ELElBQUksVUFBVSxHQUFHLElBQUkscUJB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QUNELFFBQVEsRUFBRTt3QkFDUixXQUFXLEVBQUUsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLFFBQVE7cUJBQzlCO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGLENBQUM7SUFFRixPQUFPLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDeEQsQ0FBQyxDQUFBO0FBbENZLFFBQUEsMEJBQTBCLDhCQWtDdEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb250ZXh0LCBIYW5kbGVyIH0gZnJvbSBcImF3cy1sYW1iZGFcIjtcbmltcG9ydCB7IFJpdmV0UHJvamVjdEpvYiB9IGZyb20gXCIuL2pvYlwiO1xuaW1wb3J0IHsgSm9iU3RhdHVzIH0gZnJvbSBcIi4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL2pvYlwiO1xuaW1wb3J0IHsgS1BBSGFuZGxlciwgS1BBT3B0aW9ucywgV29ya2VyU3RhdHVzIH0gZnJvbSBcIi4uLy4uL2Jhc2UtaW50ZWdyYXRpb24vc3JjL3dvcmtlclwiO1xuaW1wb3J0IHsgS1BBUml2ZXRDb25maWd1cmF0aW9uREIgfSBmcm9tIFwiLi9tb25nb2RiXCI7XG5pbXBvcnQgeyBkZWJ1Z2xvZyB9IGZyb20gJ3V0aWwnO1xuXG4vLyBIYW5kbGVyXG5jb25zdCBleGVjID0gYXN5bmMgKGV2ZW50OiBhbnksIGNvbnRleHQ/OiBDb250ZXh0LCBrcGFPcHRpb25zPzpLUEFPcHRpb25zKSA9PiB7XG4gIGNvbnN0IGxvZ2dlciA9IGtwYU9wdGlvbnM/LmxvZ2dlciB8fCBjb25zb2xlLmxvZztcbiAgZGVidWdsb2coJ2xvZzp3b3JrZXI6cml2ZXQ6cHJvamVjdDplbnYnKSgnIyMgRU5WSVJPTk1FTlQgVkFSSUFCTEVTOiAnICsgc2VyaWFsaXplKHByb2Nlc3MuZW52KSlcbiAgZGVidWdsb2coJ2xvZzp3b3JrZXI6cml2ZXQ6cHJvamVjdCcpKCcjIyBFVkVOVDogJyArIHNlcmlhbGl6ZShldmVudCkpXG4gIGRlYnVnbG9nKCdsb2c6d29ya2VyOnJpdmV0OnByb2plY3QnKSgnIyMgQ09OVEVYVDogJyArIHNlcmlhbGl6ZShjb250ZXh0KSlcblxuICBsb2dnZXIoXCJFeGVjdXRlIFJpdmV0IFByb2plY3QgU3RhcnRcIik7XG4gIGxldCB3b3JrZXJTdGF0dXMgPSBuZXcgV29ya2VyU3RhdHVzKCdSaXZldCBQcm9qZWN0IEhhbmRsZXInKTtcblxuICB0cnkge1xuICAgIHdvcmtlclN0YXR1cy5zdGFydCgpXG5cbiAgICBjb25zdCByZWNvcmQgPSBldmVudC5SZWNvcmRzWzBdO1xuICAgIGNvbnN0IG1lc3NhZ2VBdHRyaWJ1dGVzID0gcmVjb3JkLm1lc3NhZ2VBdHRyaWJ1dGVzO1xuICAgIGxldCBwcm9qZWN0Sm9iID0gbmV3IFJpdmV0UHJvamVjdEpvYihtZXNzYWdlQXR0cmlidXRlcyk7XG4gICAgbGV0IGpvYlN0YXR1cyA9IG5ldyBKb2JTdGF0dXMocHJvamVjdEpvYi5uYW1lKTtcbiAgICB3b3JrZXJTdGF0dXMuam9iTG9nLnB1c2goam9iU3RhdHVzKTtcblxuICAgIHRyeSB7XG4gICAgICBqb2JTdGF0dXMuc3RhcnQoKVxuICAgICAgYXdhaXQgcHJvamVjdEpvYi5leGVjdXRlKGpvYlN0YXR1cyk7XG4gICAgfSBjYXRjaCAoZTphbnkpIHtcbiAgICAgIGpvYlN0YXR1cy5lcnJvciA9IHtcbiAgICAgICAgbWVzc2FnZTogU3RyaW5nKGUpLFxuICAgICAgICBzdGFjazogZS5zdGFjayxcbiAgICAgIH1cbiAgICAgIHRocm93IGU7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgam9iU3RhdHVzLmRvbmUoKVxuICAgIH1cblxuICB9IGNhdGNoKGUpIHtcbiAgICB3b3JrZXJTdGF0dXMuZXJyb3IgPSBTdHJpbmcoZSk7XG4gICAgbG9nZ2VyKGBXb3JrZXIgU3RvcCB3aXRoIFVuZXhwZWN0ZWQgRXJyb3IgOiAke2V9YCk7XG4gIH0gZmluYWxseSB7XG4gICAgd29ya2VyU3RhdHVzLmRvbmUoKVxuICB9XG5cbiAgbG9nZ2VyKFwiRXhlY3V0ZSBSaXZldCBQcm9qZWN0IERvbmVcIik7XG5cbiAgY29uc3QgcmVzcG9uc2UgPSB7XG4gICAgXCJzdGF0dXNDb2RlXCI6IDIwMCxcbiAgICBcInNvdXJjZVwiOiBcIlJpdmV0IFByb2plY3QgSW50ZWdyYXRpb25cIixcbiAgICBcImJvZHlcIjogd29ya2VyU3RhdHVzLFxuICB9XG5cbiAgcmV0dXJuIHJlc3BvbnNlXG59XG5cbnZhciBzZXJpYWxpemUgPSBmdW5jdGlvbihvYmplY3Q6IGFueSkge1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqZWN0LCBudWxsLCAyKVxufVxuXG5leHBvcnQgY29uc3Qgcml2ZXRQcm9qZWN0TGFtYmRhSGFuZGxlciA6IEhhbmRsZXIgPSBhc3luYyAoZXZlbnQ6IGFueSwgY29udGV4dDogQ29udGV4dCkgPT4ge1xuICByZXR1cm4gZXhlYyhldmVudCwgY29udGV4dCk7XG59XG5cbmV4cG9ydCBjb25zdCByaXZldFByb2plY3RTeW5jS1BBSGFuZGxlciA6IEtQQUhhbmRsZXIgPSBhc3luYyAoZXZlbnQ6IGFueSwga3BhT3B0aW9uczogS1BBT3B0aW9ucykgPT4ge1xuXG4gIGNvbnN0IHJlY29yZCA9IGV2ZW50LlJlY29yZHNbMF07XG4gIGNvbnN0IG1lc3NhZ2VBdHRyaWJ1dGVzID0gcmVjb3JkLm1lc3NhZ2VBdHRyaWJ1dGVzO1xuICBsZXQga3BhVG9rZW4gPSBtZXNzYWdlQXR0cmlidXRlc1sna3BhVG9rZW4nXVsnc3RyaW5nVmFsdWUnXTtcblxuICBjb25zdCBjb25maWdEQiA9IG5ldyBLUEFSaXZldENvbmZpZ3VyYXRpb25EQigpO1xuICBsZXQgY29uZmlnID0gYXdhaXQgY29uZmlnREIuZ2V0Q29uZmlndXJhdGlvbkJ5S3BhVG9rZW4oa3BhVG9rZW4pO1xuXG4gIGNvbnN0IGxhbWJkYVJlY29yZFByb3h5ID0ge1xuICAgIFJlY29yZHM6IFtcbiAgICAgIHtcbiAgICAgICAgbWVzc2FnZUF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBjbGllbnRJZDoge1xuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IGNvbmZpZz8uY2xpZW50SWRcbiAgICAgICAgICB9LFxuICAgICAgICAgIHRva2VuOiB7XG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogY29uZmlnPy50b2tlblxuICAgICAgICAgIH0sXG4gICAgICAgICAgaXNFZGl0UHJvamVjdDoge1xuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IGNvbmZpZz8uaXNFZGl0UHJvamVjdCA/ICcxJyA6ICcwJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGtwYVNpdGU6IHtcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiBjb25maWc/LmtwYVNpdGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIGtwYVRva2VuOiB7XG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogY29uZmlnPy5rcGFUb2tlblxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIF0sXG4gIH07XG5cbiAgcmV0dXJuIGV4ZWMobGFtYmRhUmVjb3JkUHJveHksIHVuZGVmaW5lZCwga3BhT3B0aW9ucyk7XG59XG4iXX0=