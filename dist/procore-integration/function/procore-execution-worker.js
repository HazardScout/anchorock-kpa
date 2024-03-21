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
    (0, util_1.debuglog)('log:worker:env')('## ENVIRONMENT VARIABLES: ' + serialize(process.env));
    (0, util_1.debuglog)('log:worker')('## EVENT: ' + serialize(event));
    (0, util_1.debuglog)('log:worker')('## CONTEXT: ' + serialize(context || kpaOptions));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY29yZS1leGVjdXRpb24td29ya2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vcHJvY29yZS1pbnRlZ3JhdGlvbi9mdW5jdGlvbi9wcm9jb3JlLWV4ZWN1dGlvbi13b3JrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsK0JBQWdDO0FBQ2hDLHdEQUEyRDtBQUMzRCw4REFBaUU7QUFDakUsdUNBQXNEO0FBQ3RELCtCQUEwRDtBQUUxRCxNQUFNLElBQUksR0FBRyxLQUFLLEVBQUUsS0FBVSxFQUFFLE9BQWlCLEVBQUUsVUFBc0IsRUFBRSxFQUFFO0lBQzNFLE1BQU0sTUFBTSxHQUFHLENBQUEsVUFBVSxhQUFWLFVBQVUsdUJBQVYsVUFBVSxDQUFFLE1BQU0sS0FBSSxPQUFPLENBQUMsR0FBRyxDQUFDO0lBQ2pELElBQUEsZUFBUSxFQUFDLGdCQUFnQixDQUFDLENBQUMsNEJBQTRCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO0lBQ2pGLElBQUEsZUFBUSxFQUFDLFlBQVksQ0FBQyxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtJQUN2RCxJQUFBLGVBQVEsRUFBQyxZQUFZLENBQUMsQ0FBQyxjQUFjLEdBQUcsU0FBUyxDQUFDLE9BQU8sSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFBO0lBRXpFLE1BQU0sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0lBQzFDLElBQUksWUFBWSxHQUFHLElBQUkscUJBQVksQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0lBRWpFLElBQUksQ0FBQztRQUNILFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUNwQixNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDO1FBRW5ELDZFQUE2RTtRQUM3RSxJQUFJ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QUVsQztBQUVNLE1BQU0sbUJBQW1CLEdBQWdCLEtBQUssRUFBRSxLQUFVLEVBQUUsVUFBc0IsRUFBRSxFQUFFO0lBQzNGLE9BQU8sSUFBSSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDNUMsQ0FBQyxDQUFBO0FBRlksUUFBQSxtQkFBbUIsdUJBRS9CO0FBRUQsTUFBTSxTQUFTLEdBQUcsVUFBUyxNQUFXO0lBQ3BDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ3hDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnRleHQsIEhhbmRsZXIgfSBmcm9tIFwiYXdzLWxhbWJkYVwiO1xuaW1wb3J0IHsgZGVidWdsb2cgfSBmcm9tICd1dGlsJztcbmltcG9ydCB7IEpvYlN0YXR1cyB9IGZyb20gXCIuLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy9qb2JcIjtcbmltcG9ydCB7IFdvcmtlclN0YXR1cyB9IGZyb20gXCIuLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy93b3JrZXJcIjtcbmltcG9ydCB7IEtQQVByb2NvcmVDb25maWd1cmF0aW9uREIgfSBmcm9tIFwiLi9tb25nb2RiXCI7XG5pbXBvcnQgeyBQcm9jb3JlUHJvamVjdEpvYiwgUHJvY29yZVVzZXJKb2IgfSBmcm9tIFwiLi9qb2JcIjtcblxuY29uc3QgZXhlYyA9IGFzeW5jIChldmVudDogYW55LCBjb250ZXh0PzogQ29udGV4dCwga3BhT3B0aW9ucz86S1BBT3B0aW9ucykgPT4ge1xuICBjb25zdCBsb2dnZXIgPSBrcGFPcHRpb25zPy5sb2dnZXIgfHwgY29uc29sZS5sb2c7XG4gIGRlYnVnbG9nKCdsb2c6d29ya2VyOmVudicpKCcjIyBFTlZJUk9OTUVOVCBWQVJJQUJMRVM6ICcgKyBzZXJpYWxpemUocHJvY2Vzcy5lbnYpKVxuICBkZWJ1Z2xvZygnbG9nOndvcmtlcicpKCcjIyBFVkVOVDogJyArIHNlcmlhbGl6ZShldmVudCkpXG4gIGRlYnVnbG9nKCdsb2c6d29ya2VyJykoJyMjIENPTlRFWFQ6ICcgKyBzZXJpYWxpemUoY29udGV4dCB8fCBrcGFPcHRpb25zKSlcblxuICBsb2dnZXIoXCJFeGVjdXRlIFByb2NvcmUgRXhlY3V0aW9uIFN0YXJ0XCIpO1xuICBsZXQgd29ya2VyU3RhdHVzID0gbmV3IFdvcmtlclN0YXR1cygnUHJvY29yZSBFeGVjdXRpb24gSGFuZGxlcicpO1xuXG4gIHRyeSB7XG4gICAgd29ya2VyU3RhdHVzLnN0YXJ0KClcbiAgICBjb25zdCByZWNvcmQgPSBldmVudC5SZWNvcmRzWzBdO1xuICAgIGNvbnN0IG1lc3NhZ2VBdHRyaWJ1dGVzID0gcmVjb3JkLm1lc3NhZ2VBdHRyaWJ1dGVzO1xuXG4gICAgLy8gbGV0IGtwYVRva2VuID0gYCR7bWVzc2FnZUF0dHJpYnV0ZXMuZ2V0KCdrcGFUb2tlbicpPy5nZXQoJ3N0cmluZ1ZhbHVlJyl9YDtcbiAgICBsZXQga3BhVG9rZW4gPSBtZXNzYWdlQXR0cmlidXRlc1sna3BhVG9rZW4nXVsnc3RyaW5nVmFsdWUnXTtcblxuICAgIGNvbnN0IGNvbmZpZ0RCID0gbmV3IEtQQVByb2NvcmVDb25maWd1cmF0aW9uREIoKTtcbiAgICBsZXQgY29uZmlnID0gYXdhaXQgY29uZmlnREIuZ2V0Q29uZmlndXJhdGlvbkJ5S3BhVG9rZW4oa3BhVG9rZW4pO1xuXG4gICAgaWYgKGNvbmZpZyAhPSBudWxsKSB7XG4gICAgICBpZiAoY29uZmlnLmlzU3luY1VzZXIpIHtcbiAgICAgICAgbGV0IHVzZXJKb2IgPSBuZXcgUHJvY29yZVVzZXJKb2IoY29uZmlnKTtcbiAgICAgICAgbGV0IGpvYlN0YXR1cyA9IG5ldyBKb2JTdGF0dXModXNlckpvYi5uYW1lKTtcbiAgICAgICAgd29ya2VyU3RhdHVzLmpvYkxvZy5wdXNoKGpvYlN0YXR1cyk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBqb2JTdGF0dXMuc3RhcnQoKVxuICAgICAgICAgIGF3YWl0IHVzZXJKb2IuZXhlY3V0ZShqb2JTdGF0dXMpO1xuICAgICAgICB9IGNhdGNoIChlOmFueSkge1xuICAgICAgICAgICAgam9iU3RhdHVzLmVycm9yID0ge1xuICAgICAgICAgICAgICBtZXNzYWdlOiBTdHJpbmcoZSksXG4gICAgICAgICAgICAgIHN0YWNrOiBlLnN0YWNrLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIGpvYlN0YXR1cy5kb25lKClcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLmlzU3luY1Byb2plY3QpIHtcbiAgICAgICAgbGV0IHByb2plY3RKb2IgPSBuZXcgUHJvY29yZVByb2plY3RKb2IoY29uZmlnKTtcbiAgICAgICAgbGV0IGpvYlN0YXR1cyA9IG5ldyBKb2JTdGF0dXMocHJvamVjdEpvYi5uYW1lKTtcbiAgICAgICAgd29ya2VyU3RhdHVzLmpvYkxvZy5wdXNoKGpvYlN0YXR1cyk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBqb2JTdGF0dXMuc3RhcnQoKVxuICAgICAgICAgIGF3YWl0IHByb2plY3RKb2IuZXhlY3V0ZShqb2JTdGF0dXMpO1xuICAgICAgICB9IGNhdGNoIChlOmFueSkge1xuICAgICAgICAgICAgam9iU3RhdHVzLmVycm9yID0ge1xuICAgICAgICAgICAgICBtZXNzYWdlOiBTdHJpbmcoZSksXG4gICAgICAgICAgICAgIHN0YWNrOiBlLnN0YWNrLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIGpvYlN0YXR1cy5kb25lKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuXG4gIH0gY2F0Y2goZTphbnkpIHtcbiAgICB3b3JrZXJTdGF0dXMuZXJyb3IgPSBTdHJpbmcoZSk7XG4gICAgbG9nZ2VyKGBXb3JrZXIgU3RvcCB3aXRoIFVuZXhwZWN0ZWQgRXJyb3IgOiAke1N0cmluZyhlKX1gKTtcbiAgICBjb25zb2xlLmVycm9yKCdXb3JrZXIgU3RvcCB3aXRoIFVuZXhwZWN0ZWQgRXJyb3InLCBlKTtcbiAgfSBmaW5hbGx5IHtcbiAgICB3b3JrZXJTdGF0dXMuZG9uZSgpXG4gIH1cblxuICBsb2dnZXIoXCJFeGVjdXRlIFByb2NvcmUgRXhlY3V0aW9uIERvbmVcIik7XG5cbiAgY29uc3QgcmVzcG9uc2UgPSB7XG4gICAgXCJzdGF0dXNDb2RlXCI6IDIwMCxcbiAgICBcInNvdXJjZVwiOiBcIlByb2NvcmUgRXhlY3V0aW9uIEludGVncmF0aW9uXCIsXG4gICAgXCJib2R5XCI6IHdvcmtlclN0YXR1cyxcbiAgfVxuXG4gIHJldHVybiByZXNwb25zZVxufVxuXG5leHBvcnQgY29uc3QgZXhlY3V0aW9uTGFtYmRhSGFuZGxlciA6IEhhbmRsZXIgPSBhc3luYyAoZXZlbnQ6IGFueSwgY29udGV4dDogQ29udGV4dCkgPT4ge1xuICByZXR1cm4gZXhlYyhldmVudCwgY29udGV4dCk7XG59XG5cbmV4cG9ydCBjb25zdCBleGVjdXRpb25LUEFIYW5kbGVyIDogS1BBSGFuZGxlciA9IGFzeW5jIChldmVudDogYW55LCBrcGFPcHRpb25zOiBLUEFPcHRpb25zKSA9PiB7XG4gIHJldHVybiBleGVjKGV2ZW50LCB1bmRlZmluZWQsIGtwYU9wdGlvbnMpO1xufVxuXG5jb25zdCBzZXJpYWxpemUgPSBmdW5jdGlvbihvYmplY3Q6IGFueSkge1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqZWN0LCBudWxsLCAyKVxufVxuXG5leHBvcnQgdHlwZSBLUEFPcHRpb25zID0ge1xuICBsb2dnZXI/OiAoLi4uZGF0YTphbnlbXSkgPT4gdm9pZCxcbn1cblxuZXhwb3J0IHR5cGUgS1BBSGFuZGxlciA9IChldmVudDogYW55LCBrcGFPcHRpb25zOktQQU9wdGlvbnMpID0+IGFueTtcbiJdfQ==