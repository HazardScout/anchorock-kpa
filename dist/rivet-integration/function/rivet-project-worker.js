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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicml2ZXQtcHJvamVjdC13b3JrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9yaXZldC1pbnRlZ3JhdGlvbi9mdW5jdGlvbi9yaXZldC1wcm9qZWN0LXdvcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwrQkFBd0M7QUFDeEMsd0RBQTJEO0FBQzNELDhEQUF5RjtBQUN6Rix1Q0FBb0Q7QUFDcEQsK0JBQWdDO0FBRWhDLFVBQVU7QUFDVixNQUFNLElBQUksR0FBRyxLQUFLLEVBQUUsS0FBVSxFQUFFLE9BQWlCLEVBQUUsVUFBc0IsRUFBRSxFQUFFO0lBQzNFLE1BQU0sTUFBTSxHQUFHLENBQUEsVUFBVSxhQUFWLFVBQVUsdUJBQVYsVUFBVSxDQUFFLE1BQU0sS0FBSSxPQUFPLENBQUMsR0FBRyxDQUFDO0lBQ2pELElBQUEsZUFBUSxFQUFDLDRCQUE0QixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtJQUMvRCxJQUFBLGVBQVEsRUFBQyxZQUFZLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7SUFDekMsSUFBQSxlQUFRLEVBQUMsY0FBYyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBRTdDLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0lBQ3RDLElBQUksWUFBWSxHQUFHLElBQUkscUJBQVksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0lBRTdELElBQUksQ0FBQztRQUNILFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUVwQixNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDO1FBQ25ELElBQUksVUFBVSxHQUFHLElBQUkscUJBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3hELElBQUksU0FBUyxHQUFHLElBQUksZUFBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUVwQyxJQUFJLENBQUM7WUFDSCxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUE7WUFDakIsTUFBTSxVQUFVLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3RDLENBQUM7UUFBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQ1QsU0FBUyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDM0IsTUFBTSxDQUFDLENBQUM7UUFDWixDQUFDO2dCQUFTLENBQUM7WUFDUCxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUE7UUFDcEIsQ0FBQztJQUVILENBQUM7SUFBQyxPQUFNLENBQUMsRUFBRSxDQUFDO1FBQ1YsWUFBWSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0IsTUFBTSxDQUFDLHVDQUF1QyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3JELENBQUM7WUFBUyxDQUFDO1FBQ1QsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFBO0lBQ3JCLENBQUM7SUFFRCxNQUFNLENBQUMsNEJBQTRCLENBQUMsQ0FBQztJQUVyQyxNQUFNLFFBQVEsR0FBRztRQUNmLFlBQVksRUFBRSxHQUFHO1FBQ2pCLFFBQVEsRUFBRSwyQkFBMkI7UUFDckMsTUFBTSxFQUFFLFlBQVk7S0FDckIsQ0FBQTtJQUVELE9BQU8sUUFBUSxDQUFBO0FBQ2pCLENBQUMsQ0FBQTtBQUVELElBQUksU0FBUyxHQUFHLFVBQVMsTUFBVztJQUNsQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUN4QyxDQUFDLENBQUE7QUFFTSxNQUFNLHlCQUF5QixHQUFhLEtBQUssRUFBRSxLQUFVLEVBQUUsT0FBZ0IsRUFBRSxFQUFFO0lBQ3hGLE9BQU8sSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztBQUM5QixDQUFDLENBQUE7QUFGWSxRQUFBLHlCQUF5Qiw2QkFFckM7QUFFTSxNQUFNLDBCQUEwQixHQUFnQixLQUFLLEVBQUUsS0FBVSxFQUFFLFVBQXNCLEVBQUUsRUFBRTtJQUVsRyxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDO0lBQ25ELElBQUksUUFBUSxHQUFHLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBRTVELE1BQU0sUUFBUSxHQUFHLElBQUksaUNBQXVCLEVBQUUsQ0FBQztJQUMvQyxJQUFJLE1BQU0sR0FBRyxNQUFNLFFBQVEsQ0FBQywwQkFBMEIsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUVqRSxNQUFNLGlCQUFpQixHQUFHO1FBQ3hCLE9BQU8sRUFBRTtZQUNQO2dCQUNFLGlCQUFpQixFQUFFO29CQUNqQixRQUFRLEVBQUU7d0JBQ1IsV0FBVyxFQUFFLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxRQUFRO3FCQUM5QjtvQkFDRCxLQUFLLEVBQUU7d0JBQ0wsV0FBVyxFQUFFLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxLQUFLO3FCQUMzQjtvQkFDRCxhQUFhLEVBQUU7d0JBQ2IsV0FBVyxFQUFFLENBQUEsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLGFBQWEsRUFBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHO3FCQUMvQztvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsV0FBVyxFQUFFLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxPQUFPO3FCQUM3QjtvQkFDRCxRQUFRLEVBQUU7d0JBQ1IsV0FBVyxFQUFFLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxRQUFRO3FCQUM5QjtpQkFDRjthQUNGO1NBQ0Y7S0FDRixDQUFDO0lBRUYsT0FBTyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3hELENBQUMsQ0FBQTtBQWxDWSxRQUFBLDBCQUEwQiw4QkFrQ3RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29udGV4dCwgSGFuZGxlciB9IGZyb20gXCJhd3MtbGFtYmRhXCI7XG5pbXBvcnQgeyBSaXZldFByb2plY3RKb2IgfSBmcm9tIFwiLi9qb2JcIjtcbmltcG9ydCB7IEpvYlN0YXR1cyB9IGZyb20gXCIuLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy9qb2JcIjtcbmltcG9ydCB7IEtQQUhhbmRsZXIsIEtQQU9wdGlvbnMsIFdvcmtlclN0YXR1cyB9IGZyb20gXCIuLi8uLi9iYXNlLWludGVncmF0aW9uL3NyYy93b3JrZXJcIjtcbmltcG9ydCB7IEtQQVJpdmV0Q29uZmlndXJhdGlvbkRCIH0gZnJvbSBcIi4vbW9uZ29kYlwiO1xuaW1wb3J0IHsgZGVidWdsb2cgfSBmcm9tICd1dGlsJztcblxuLy8gSGFuZGxlclxuY29uc3QgZXhlYyA9IGFzeW5jIChldmVudDogYW55LCBjb250ZXh0PzogQ29udGV4dCwga3BhT3B0aW9ucz86S1BBT3B0aW9ucykgPT4ge1xuICBjb25zdCBsb2dnZXIgPSBrcGFPcHRpb25zPy5sb2dnZXIgfHwgY29uc29sZS5sb2c7XG4gIGRlYnVnbG9nKCcjIyBFTlZJUk9OTUVOVCBWQVJJQUJMRVM6ICcgKyBzZXJpYWxpemUocHJvY2Vzcy5lbnYpKVxuICBkZWJ1Z2xvZygnIyMgRVZFTlQ6ICcgKyBzZXJpYWxpemUoZXZlbnQpKVxuICBkZWJ1Z2xvZygnIyMgQ09OVEVYVDogJyArIHNlcmlhbGl6ZShjb250ZXh0KSlcbiAgXG4gIGxvZ2dlcihcIkV4ZWN1dGUgUml2ZXQgUHJvamVjdCBTdGFydFwiKTtcbiAgbGV0IHdvcmtlclN0YXR1cyA9IG5ldyBXb3JrZXJTdGF0dXMoJ1JpdmV0IFByb2plY3QgSGFuZGxlcicpO1xuICBcbiAgdHJ5IHtcbiAgICB3b3JrZXJTdGF0dXMuc3RhcnQoKVxuXG4gICAgY29uc3QgcmVjb3JkID0gZXZlbnQuUmVjb3Jkc1swXTtcbiAgICBjb25zdCBtZXNzYWdlQXR0cmlidXRlcyA9IHJlY29yZC5tZXNzYWdlQXR0cmlidXRlcztcbiAgICBsZXQgcHJvamVjdEpvYiA9IG5ldyBSaXZldFByb2plY3RKb2IobWVzc2FnZUF0dHJpYnV0ZXMpO1xuICAgIGxldCBqb2JTdGF0dXMgPSBuZXcgSm9iU3RhdHVzKHByb2plY3RKb2IubmFtZSk7XG4gICAgd29ya2VyU3RhdHVzLmpvYkxvZy5wdXNoKGpvYlN0YXR1cyk7XG5cbiAgICB0cnkge1xuICAgICAgam9iU3RhdHVzLnN0YXJ0KClcbiAgICAgIGF3YWl0IHByb2plY3RKb2IuZXhlY3V0ZShqb2JTdGF0dXMpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgam9iU3RhdHVzLmVycm9yID0gU3RyaW5nKGUpXG4gICAgICAgIHRocm93IGU7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgam9iU3RhdHVzLmRvbmUoKVxuICAgIH1cbiAgICBcbiAgfSBjYXRjaChlKSB7XG4gICAgd29ya2VyU3RhdHVzLmVycm9yID0gU3RyaW5nKGUpO1xuICAgIGxvZ2dlcihgV29ya2VyIFN0b3Agd2l0aCBVbmV4cGVjdGVkIEVycm9yIDogJHtlfWApO1xuICB9IGZpbmFsbHkge1xuICAgIHdvcmtlclN0YXR1cy5kb25lKClcbiAgfVxuICBcbiAgbG9nZ2VyKFwiRXhlY3V0ZSBSaXZldCBQcm9qZWN0IERvbmVcIik7XG4gIFxuICBjb25zdCByZXNwb25zZSA9IHtcbiAgICBcInN0YXR1c0NvZGVcIjogMjAwLFxuICAgIFwic291cmNlXCI6IFwiUml2ZXQgUHJvamVjdCBJbnRlZ3JhdGlvblwiLFxuICAgIFwiYm9keVwiOiB3b3JrZXJTdGF0dXMsXG4gIH1cbiAgXG4gIHJldHVybiByZXNwb25zZVxufVxuXG52YXIgc2VyaWFsaXplID0gZnVuY3Rpb24ob2JqZWN0OiBhbnkpIHtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iamVjdCwgbnVsbCwgMilcbn1cblxuZXhwb3J0IGNvbnN0IHJpdmV0UHJvamVjdExhbWJkYUhhbmRsZXIgOiBIYW5kbGVyID0gYXN5bmMgKGV2ZW50OiBhbnksIGNvbnRleHQ6IENvbnRleHQpID0+IHtcbiAgcmV0dXJuIGV4ZWMoZXZlbnQsIGNvbnRleHQpO1xufVxuXG5leHBvcnQgY29uc3Qgcml2ZXRQcm9qZWN0U3luY0tQQUhhbmRsZXIgOiBLUEFIYW5kbGVyID0gYXN5bmMgKGV2ZW50OiBhbnksIGtwYU9wdGlvbnM6IEtQQU9wdGlvbnMpID0+IHtcblxuICBjb25zdCByZWNvcmQgPSBldmVudC5SZWNvcmRzWzBdO1xuICBjb25zdCBtZXNzYWdlQXR0cmlidXRlcyA9IHJlY29yZC5tZXNzYWdlQXR0cmlidXRlcztcbiAgbGV0IGtwYVRva2VuID0gbWVzc2FnZUF0dHJpYnV0ZXNbJ2twYVRva2VuJ11bJ3N0cmluZ1ZhbHVlJ107XG5cbiAgY29uc3QgY29uZmlnREIgPSBuZXcgS1BBUml2ZXRDb25maWd1cmF0aW9uREIoKTtcbiAgbGV0IGNvbmZpZyA9IGF3YWl0IGNvbmZpZ0RCLmdldENvbmZpZ3VyYXRpb25CeUtwYVRva2VuKGtwYVRva2VuKTtcblxuICBjb25zdCBsYW1iZGFSZWNvcmRQcm94eSA9IHtcbiAgICBSZWNvcmRzOiBbXG4gICAgICB7XG4gICAgICAgIG1lc3NhZ2VBdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgY2xpZW50SWQ6IHtcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiBjb25maWc/LmNsaWVudElkXG4gICAgICAgICAgfSxcbiAgICAgICAgICB0b2tlbjoge1xuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IGNvbmZpZz8udG9rZW5cbiAgICAgICAgICB9LFxuICAgICAgICAgIGlzRWRpdFByb2plY3Q6IHtcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiBjb25maWc/LmlzRWRpdFByb2plY3QgPyAnMScgOiAnMCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBrcGFTaXRlOiB7XG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogY29uZmlnPy5rcGFTaXRlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBrcGFUb2tlbjoge1xuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IGNvbmZpZz8ua3BhVG9rZW5cbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdLFxuICB9O1xuXG4gIHJldHVybiBleGVjKGxhbWJkYVJlY29yZFByb3h5LCB1bmRlZmluZWQsIGtwYU9wdGlvbnMpO1xufVxuIl19