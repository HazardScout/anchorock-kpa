"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executionKPAHandler = exports.executionLambdaHandler = void 0;
const util_1 = require("util");
const job_1 = require("../../base-integration/src/job");
const worker_1 = require("../../base-integration/src/worker");
const mongodb_1 = require("./mongodb");
const job_2 = require("./job");
const exec = async (event, context, kpaOptions) => {
    const logger = (kpaOptions === null || kpaOptions === void 0 ? void 0 : kpaOptions.logger) || console.log;
    (0, util_1.debuglog)('env')('## ENVIRONMENT VARIABLES: ' + serialize(process.env));
    logger('## EVENT: ' + serialize(event));
    logger('## CONTEXT: ' + serialize(context || kpaOptions));
    logger("Execute Procore Execution Start");
    let workerStatus = new worker_1.WorkerStatus('Procore Execution Handler');
    try {
        workerStatus.start();
        const record = event.Records[0];
        const messageAttributes = record.messageAttributes;
        // let kpaToken = `${messageAttributes.get('kpaToken')?.get('stringValue')}`;
        let kpaToken = messageAttributes['kpaToken']['stringValue'];
        const configDB = new mongodb_1.KPAProcoreConfigurationDB();
        let config = await configDB.getConfigurationByKpaToken(kpaToken);
        if (config != null) {
            if (config.isSyncUser) {
                let userJob = new job_2.ProcoreUserJob(config);
                let jobStatus = new job_1.JobStatus(userJob.name);
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
                }
                finally {
                    jobStatus.done();
                }
            }
            if (config.isSyncProject) {
                let projectJob = new job_2.ProcoreProjectJob(config);
                let jobStatus = new job_1.JobStatus(projectJob.name);
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
                }
                finally {
                    jobStatus.done();
                }
            }
        }
    }
    catch (e) {
        workerStatus.error = String(e);
        logger(`Worker Stop with Unexpected Error : ${String(e)}`);
        console.error('Worker Stop with Unexpected Error', e);
    }
    finally {
        workerStatus.done();
    }
    logger("Execute Procore Execution Done");
    const response = {
        "statusCode": 200,
        "source": "Procore Execution Integration",
        "body": workerStatus,
    };
    return response;
};
const executionLambdaHandler = async (event, context) => {
    return exec(event, context);
};
exports.executionLambdaHandler = executionLambdaHandler;
const executionKPAHandler = async (event, kpaOptions) => {
    return exec(event, undefined, kpaOptions);
};
exports.executionKPAHandler = executionKPAHandler;
const serialize = function (object) {
    return JSON.stringify(object, null, 2);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY29yZS1leGVjdXRpb24td29ya2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vcHJvY29yZS1pbnRlZ3JhdGlvbi9mdW5jdGlvbi9wcm9jb3JlLWV4ZWN1dGlvbi13b3JrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsK0JBQWdDO0FBQ2hDLHdEQUEyRDtBQUMzRCw4REFBaUU7QUFDakUsdUNBQXNEO0FBQ3RELCtCQUEwRDtBQUUxRCxNQUFNLElBQUksR0FBRyxLQUFLLEVBQUUsS0FBVSxFQUFFLE9BQWlCLEVBQUUsVUFBc0IsRUFBRSxFQUFFO0lBQzNFLE1BQU0sTUFBTSxHQUFHLENBQUEsVUFBVSxhQUFWLFVBQVUsdUJBQVYsVUFBVSxDQUFFLE1BQU0sS0FBSSxPQUFPLENBQUMsR0FBRyxDQUFDO0lBQ2pELElBQUEsZUFBUSxFQUFDLEtBQUssQ0FBQyxDQUFDLDRCQUE0QixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtJQUN0RSxNQUFNLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFBO0lBQ3ZDLE1BQU0sQ0FBQyxjQUFjLEdBQUcsU0FBUyxDQUFDLE9BQU8sSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFBO0lBRXpELE1BQU0sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0lBQzFDLElBQUksWUFBWSxHQUFHLElBQUkscUJBQVksQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0lBRWpFLElBQUksQ0FBQztRQUNILFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUNwQixNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDO1FBRW5ELDZFQUE2RTtRQUM3RSxJQUFJLFFBQVEsR0FBRyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxhQUFh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LEVBQUUsVUFBc0IsRUFBRSxFQUFFO0lBQzNGLE9BQU8sSUFBSSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDNUMsQ0FBQyxDQUFBO0FBRlksUUFBQSxtQkFBbUIsdUJBRS9CO0FBRUQsTUFBTSxTQUFTLEdBQUcsVUFBUyxNQUFXO0lBQ3BDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ3hDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnRleHQsIEhhbmRsZXIgfSBmcm9tIFwiYXdzLWxhbWJkYVwiO1xuaW1wb3J0IHsgZGVidWdsb2cgfSBmcm9tICd1dGlsJztcbmltcG9ydCB7IEpvYlN0YXR1cyB9IGZyb20gXCIuLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy9qb2JcIjtcbmltcG9ydCB7IFdvcmtlclN0YXR1cyB9IGZyb20gXCIuLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy93b3JrZXJcIjtcbmltcG9ydCB7IEtQQVByb2NvcmVDb25maWd1cmF0aW9uREIgfSBmcm9tIFwiLi9tb25nb2RiXCI7XG5pbXBvcnQgeyBQcm9jb3JlUHJvamVjdEpvYiwgUHJvY29yZVVzZXJKb2IgfSBmcm9tIFwiLi9qb2JcIjtcblxuY29uc3QgZXhlYyA9IGFzeW5jIChldmVudDogYW55LCBjb250ZXh0PzogQ29udGV4dCwga3BhT3B0aW9ucz86S1BBT3B0aW9ucykgPT4ge1xuICBjb25zdCBsb2dnZXIgPSBrcGFPcHRpb25zPy5sb2dnZXIgfHwgY29uc29sZS5sb2c7XG4gIGRlYnVnbG9nKCdlbnYnKSgnIyMgRU5WSVJPTk1FTlQgVkFSSUFCTEVTOiAnICsgc2VyaWFsaXplKHByb2Nlc3MuZW52KSlcbiAgbG9nZ2VyKCcjIyBFVkVOVDogJyArIHNlcmlhbGl6ZShldmVudCkpXG4gIGxvZ2dlcignIyMgQ09OVEVYVDogJyArIHNlcmlhbGl6ZShjb250ZXh0IHx8IGtwYU9wdGlvbnMpKVxuXG4gIGxvZ2dlcihcIkV4ZWN1dGUgUHJvY29yZSBFeGVjdXRpb24gU3RhcnRcIik7XG4gIGxldCB3b3JrZXJTdGF0dXMgPSBuZXcgV29ya2VyU3RhdHVzKCdQcm9jb3JlIEV4ZWN1dGlvbiBIYW5kbGVyJyk7XG5cbiAgdHJ5IHtcbiAgICB3b3JrZXJTdGF0dXMuc3RhcnQoKVxuICAgIGNvbnN0IHJlY29yZCA9IGV2ZW50LlJlY29yZHNbMF07XG4gICAgY29uc3QgbWVzc2FnZUF0dHJpYnV0ZXMgPSByZWNvcmQubWVzc2FnZUF0dHJpYnV0ZXM7XG5cbiAgICAvLyBsZXQga3BhVG9rZW4gPSBgJHttZXNzYWdlQXR0cmlidXRlcy5nZXQoJ2twYVRva2VuJyk/LmdldCgnc3RyaW5nVmFsdWUnKX1gO1xuICAgIGxldCBrcGFUb2tlbiA9IG1lc3NhZ2VBdHRyaWJ1dGVzWydrcGFUb2tlbiddWydzdHJpbmdWYWx1ZSddO1xuXG4gICAgY29uc3QgY29uZmlnREIgPSBuZXcgS1BBUHJvY29yZUNvbmZpZ3VyYXRpb25EQigpO1xuICAgIGxldCBjb25maWcgPSBhd2FpdCBjb25maWdEQi5nZXRDb25maWd1cmF0aW9uQnlLcGFUb2tlbihrcGFUb2tlbik7XG5cbiAgICBpZiAoY29uZmlnICE9IG51bGwpIHtcbiAgICAgIGlmIChjb25maWcuaXNTeW5jVXNlcikge1xuICAgICAgICBsZXQgdXNlckpvYiA9IG5ldyBQcm9jb3JlVXNlckpvYihjb25maWcpO1xuICAgICAgICBsZXQgam9iU3RhdHVzID0gbmV3IEpvYlN0YXR1cyh1c2VySm9iLm5hbWUpO1xuICAgICAgICB3b3JrZXJTdGF0dXMuam9iTG9nLnB1c2goam9iU3RhdHVzKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGpvYlN0YXR1cy5zdGFydCgpXG4gICAgICAgICAgYXdhaXQgdXNlckpvYi5leGVjdXRlKGpvYlN0YXR1cyk7XG4gICAgICAgIH0gY2F0Y2ggKGU6YW55KSB7XG4gICAgICAgICAgICBqb2JTdGF0dXMuZXJyb3IgPSB7XG4gICAgICAgICAgICAgIG1lc3NhZ2U6IFN0cmluZyhlKSxcbiAgICAgICAgICAgICAgc3RhY2s6IGUuc3RhY2ssXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgam9iU3RhdHVzLmRvbmUoKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcuaXNTeW5jUHJvamVjdCkge1xuICAgICAgICBsZXQgcHJvamVjdEpvYiA9IG5ldyBQcm9jb3JlUHJvamVjdEpvYihjb25maWcpO1xuICAgICAgICBsZXQgam9iU3RhdHVzID0gbmV3IEpvYlN0YXR1cyhwcm9qZWN0Sm9iLm5hbWUpO1xuICAgICAgICB3b3JrZXJTdGF0dXMuam9iTG9nLnB1c2goam9iU3RhdHVzKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGpvYlN0YXR1cy5zdGFydCgpXG4gICAgICAgICAgYXdhaXQgcHJvamVjdEpvYi5leGVjdXRlKGpvYlN0YXR1cyk7XG4gICAgICAgIH0gY2F0Y2ggKGU6YW55KSB7XG4gICAgICAgICAgICBqb2JTdGF0dXMuZXJyb3IgPSB7XG4gICAgICAgICAgICAgIG1lc3NhZ2U6IFN0cmluZyhlKSxcbiAgICAgICAgICAgICAgc3RhY2s6IGUuc3RhY2ssXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgam9iU3RhdHVzLmRvbmUoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG5cbiAgfSBjYXRjaChlOmFueSkge1xuICAgIHdvcmtlclN0YXR1cy5lcnJvciA9IFN0cmluZyhlKTtcbiAgICBsb2dnZXIoYFdvcmtlciBTdG9wIHdpdGggVW5leHBlY3RlZCBFcnJvciA6ICR7U3RyaW5nKGUpfWApO1xuICAgIGNvbnNvbGUuZXJyb3IoJ1dvcmtlciBTdG9wIHdpdGggVW5leHBlY3RlZCBFcnJvcicsIGUpO1xuICB9IGZpbmFsbHkge1xuICAgIHdvcmtlclN0YXR1cy5kb25lKClcbiAgfVxuXG4gIGxvZ2dlcihcIkV4ZWN1dGUgUHJvY29yZSBFeGVjdXRpb24gRG9uZVwiKTtcblxuICBjb25zdCByZXNwb25zZSA9IHtcbiAgICBcInN0YXR1c0NvZGVcIjogMjAwLFxuICAgIFwic291cmNlXCI6IFwiUHJvY29yZSBFeGVjdXRpb24gSW50ZWdyYXRpb25cIixcbiAgICBcImJvZHlcIjogd29ya2VyU3RhdHVzLFxuICB9XG5cbiAgcmV0dXJuIHJlc3BvbnNlXG59XG5cbmV4cG9ydCBjb25zdCBleGVjdXRpb25MYW1iZGFIYW5kbGVyIDogSGFuZGxlciA9IGFzeW5jIChldmVudDogYW55LCBjb250ZXh0OiBDb250ZXh0KSA9PiB7XG4gIHJldHVybiBleGVjKGV2ZW50LCBjb250ZXh0KTtcbn1cblxuZXhwb3J0IGNvbnN0IGV4ZWN1dGlvbktQQUhhbmRsZXIgOiBLUEFIYW5kbGVyID0gYXN5bmMgKGV2ZW50OiBhbnksIGtwYU9wdGlvbnM6IEtQQU9wdGlvbnMpID0+IHtcbiAgcmV0dXJuIGV4ZWMoZXZlbnQsIHVuZGVmaW5lZCwga3BhT3B0aW9ucyk7XG59XG5cbmNvbnN0IHNlcmlhbGl6ZSA9IGZ1bmN0aW9uKG9iamVjdDogYW55KSB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmplY3QsIG51bGwsIDIpXG59XG5cbmV4cG9ydCB0eXBlIEtQQU9wdGlvbnMgPSB7XG4gIGxvZ2dlcj86ICguLi5kYXRhOmFueVtdKSA9PiB2b2lkLFxufVxuXG5leHBvcnQgdHlwZSBLUEFIYW5kbGVyID0gKGV2ZW50OiBhbnksIGtwYU9wdGlvbnM6S1BBT3B0aW9ucykgPT4gYW55O1xuIl19