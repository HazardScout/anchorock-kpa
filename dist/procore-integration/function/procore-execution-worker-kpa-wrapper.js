"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exec = void 0;
const procore_execution_worker_1 = require("./procore-execution-worker");
const exec = async (data, logToJob, callback) => {
    if (!data.apiToken) {
        return callback(new Error('apiToken is required!'));
    }
    const lambdaRecordProxy = {
        Records: [
            {
                messageAttributes: {
                    kpaToken: {
                        stringValue: data.apiToken
                    },
                },
            },
        ],
    };
    logToJob(`procore-wrapper: ${lambdaRecordProxy.Records[0].messageAttributes.kpaToken.stringValue.slice(-4)}`);
    try {
        const { body } = await (0, procore_execution_worker_1.executionKPAHandler)(lambdaRecordProxy, {
            logger: logToJob,
        });
        logToJob(JSON.stringify({
            status: body,
        }));
        callback();
    }
    catch (error) {
        callback(error);
    }
};
exports.exec = exec;
exports.default = exports.exec;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY29yZS1leGVjdXRpb24td29ya2VyLWtwYS13cmFwcGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vcHJvY29yZS1pbnRlZ3JhdGlvbi9mdW5jdGlvbi9wcm9jb3JlLWV4ZWN1dGlvbi13b3JrZXIta3BhLXdyYXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUVBQWlFO0FBRTFELE1BQU0sSUFBSSxHQUFHLEtBQUssRUFDdkIsSUFBd0IsRUFDeEIsUUFBZ0MsRUFDaEMsUUFBOEIsRUFDOUIsRUFBRTtJQUNGLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbkIsT0FBTyxRQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCxNQUFNLGlCQUFpQixHQUFHO1FBQ3hCLE9BQU8sRUFBRTtZQUNQO2dCQUNFLGlCQUFpQixFQUFFO29CQUNqQixRQUFRLEVBQUU7d0JBQ1IsV0FBVyxFQUFFLElBQUksQ0FBQyxRQUFRO3FCQUMzQjtpQkFDRjthQUNGO1NBQ0Y7S0FDRixDQUFDO0lBQ0YsUUFBUSxDQUFDLG9CQUFvQixpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFOUcsSUFBSSxDQUFDO1FBQ0gsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLE1BQU0sSUFBQSw4Q0FBbUIsRUFBQyxpQkFBaUIsRUFBRTtZQUM1RCxNQUFNLEVBQUUsUUFBUTtTQUNqQixDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUN0QixNQUFNLEVBQUUsSUFBSTtTQUNiLENBQUMsQ0FBQyxDQUFDO1FBRUosUUFBUSxFQUFFLENBQUM7SUFDYixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsQixDQUFDO0FBQ0gsQ0FBQyxDQUFDO0FBbkNXLFFBQUEsSUFBSSxRQW1DZjtBQUVGLGtCQUFlLFlBQUksQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV4ZWN1dGlvbktQQUhhbmRsZXIgfSBmcm9tICcuL3Byb2NvcmUtZXhlY3V0aW9uLXdvcmtlcic7XG5cbmV4cG9ydCBjb25zdCBleGVjID0gYXN5bmMgKFxuICBkYXRhOlJlY29yZDxzdHJpbmcsIGFueT4sXG4gIGxvZ1RvSm9iOiguLi5kYXRhOmFueVtdKSA9PiB2b2lkLFxuICBjYWxsYmFjazogKGVycm9yPzphbnkpID0+IHZvaWRcbikgPT4ge1xuICBpZiAoIWRhdGEuYXBpVG9rZW4pIHtcbiAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKCdhcGlUb2tlbiBpcyByZXF1aXJlZCEnKSk7XG4gIH1cblxuICBjb25zdCBsYW1iZGFSZWNvcmRQcm94eSA9IHtcbiAgICBSZWNvcmRzOiBbXG4gICAgICB7XG4gICAgICAgIG1lc3NhZ2VBdHRyaWJ1dGVzOiB7XG4gICAgICAgICAga3BhVG9rZW46IHtcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiBkYXRhLmFwaVRva2VuXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfTtcbiAgbG9nVG9Kb2IoYHByb2NvcmUtd3JhcHBlcjogJHtsYW1iZGFSZWNvcmRQcm94eS5SZWNvcmRzWzBdLm1lc3NhZ2VBdHRyaWJ1dGVzLmtwYVRva2VuLnN0cmluZ1ZhbHVlLnNsaWNlKC00KX1gKTtcblxuICB0cnkge1xuICAgIGNvbnN0IHsgYm9keSB9ID0gYXdhaXQgZXhlY3V0aW9uS1BBSGFuZGxlcihsYW1iZGFSZWNvcmRQcm94eSwge1xuICAgICAgbG9nZ2VyOiBsb2dUb0pvYixcbiAgICB9KTtcblxuICAgIGxvZ1RvSm9iKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIHN0YXR1czogYm9keSxcbiAgICB9KSk7XG5cbiAgICBjYWxsYmFjaygpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNhbGxiYWNrKGVycm9yKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZXhlYztcbiJdfQ==