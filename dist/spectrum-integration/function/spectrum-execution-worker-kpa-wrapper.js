"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exec = void 0;
const spectrum_project_worker_1 = require("./spectrum-project-worker");
const spectrum_user_worker_1 = require("./spectrum-user-worker");
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
    logToJob(`spectrum-wrapper: ${lambdaRecordProxy.Records[0].messageAttributes.kpaToken.stringValue.slice(-4)}`);
    try {
        const { body: userBody } = await (0, spectrum_user_worker_1.spectrumUserSyncKPAHandler)(lambdaRecordProxy, {
            logger: logToJob,
        });
        logToJob(JSON.stringify(userBody));
        const { body: projectBody } = await (0, spectrum_project_worker_1.spectrumProjectSyncKPAHandler)(lambdaRecordProxy, {
            logger: logToJob,
        });
        logToJob(JSON.stringify(projectBody));
        callback(null, [userBody, projectBody]);
    }
    catch (error) {
        callback(error);
    }
};
exports.exec = exec;
exports.default = exports.exec;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlY3RydW0tZXhlY3V0aW9uLXdvcmtlci1rcGEtd3JhcHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NwZWN0cnVtLWludGVncmF0aW9uL2Z1bmN0aW9uL3NwZWN0cnVtLWV4ZWN1dGlvbi13b3JrZXIta3BhLXdyYXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsdUVBQTBFO0FBQzFFLGlFQUFvRTtBQUU3RCxNQUFNLElBQUksR0FBRyxLQUFLLEVBQ3JCLElBQXdCLEVBQ3hCLFFBQWdDLEVBQ2hDLFFBQTRDLEVBQzVDLEVBQUU7SUFDRixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ25CLE9BQU8sUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsTUFBTSxpQkFBaUIsR0FBRztRQUN4QixPQUFPLEVBQUU7WUFDUDtnQkFDRSxpQkFBaUIsRUFBRTtvQkFDakIsUUFBUSxFQUFFO3dCQUNSLFdBQVcsRUFBRSxJQUFJLENBQUMsUUFBUTtxQkFDM0I7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQztJQUNGLFFBQVEsQ0FBQyxxQkFBcUIsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRS9HLElBQUksQ0FBQztRQUNILE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEdBQUcsTUFBTSxJQUFBLGlEQUEwQixFQUFDLGlCQUFpQixFQUFFO1lBQzdFLE1BQU0sRUFBRSxRQUFRO1NBQ2pCLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFFbkMsTUFBTSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsR0FBRyxNQUFNLElBQUEsdURBQTZCLEVBQUMsaUJBQWlCLEVBQUU7WUFDbkYsTUFBTSxFQUFFLFFBQVE7U0FDakIsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUV0QyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEIsQ0FBQztBQUNILENBQUMsQ0FBQztBQXZDUyxRQUFBLElBQUksUUF1Q2I7QUFFRixrQkFBZSxZQUFJLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBzcGVjdHJ1bVByb2plY3RTeW5jS1BBSGFuZGxlciB9IGZyb20gXCIuL3NwZWN0cnVtLXByb2plY3Qtd29ya2VyXCI7XG5pbXBvcnQgeyBzcGVjdHJ1bVVzZXJTeW5jS1BBSGFuZGxlciB9IGZyb20gXCIuL3NwZWN0cnVtLXVzZXItd29ya2VyXCI7XG5cbmV4cG9ydCBjb25zdCBleGVjID0gYXN5bmMgKFxuICAgIGRhdGE6UmVjb3JkPHN0cmluZywgYW55PixcbiAgICBsb2dUb0pvYjooLi4uZGF0YTphbnlbXSkgPT4gdm9pZCxcbiAgICBjYWxsYmFjazogKGVycm9yPzphbnksIHJlc3VsdHM/OmFueSkgPT4gdm9pZFxuICApID0+IHtcbiAgICBpZiAoIWRhdGEuYXBpVG9rZW4pIHtcbiAgICAgIHJldHVybiBjYWxsYmFjayhuZXcgRXJyb3IoJ2FwaVRva2VuIGlzIHJlcXVpcmVkIScpKTtcbiAgICB9XG5cbiAgICBjb25zdCBsYW1iZGFSZWNvcmRQcm94eSA9IHtcbiAgICAgIFJlY29yZHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG1lc3NhZ2VBdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICBrcGFUb2tlbjoge1xuICAgICAgICAgICAgICBzdHJpbmdWYWx1ZTogZGF0YS5hcGlUb2tlblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9O1xuICAgIGxvZ1RvSm9iKGBzcGVjdHJ1bS13cmFwcGVyOiAke2xhbWJkYVJlY29yZFByb3h5LlJlY29yZHNbMF0ubWVzc2FnZUF0dHJpYnV0ZXMua3BhVG9rZW4uc3RyaW5nVmFsdWUuc2xpY2UoLTQpfWApO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHsgYm9keTogdXNlckJvZHkgfSA9IGF3YWl0IHNwZWN0cnVtVXNlclN5bmNLUEFIYW5kbGVyKGxhbWJkYVJlY29yZFByb3h5LCB7XG4gICAgICAgIGxvZ2dlcjogbG9nVG9Kb2IsXG4gICAgICB9KTtcblxuICAgICAgbG9nVG9Kb2IoSlNPTi5zdHJpbmdpZnkodXNlckJvZHkpKTtcblxuICAgICAgY29uc3QgeyBib2R5OiBwcm9qZWN0Qm9keSB9ID0gYXdhaXQgc3BlY3RydW1Qcm9qZWN0U3luY0tQQUhhbmRsZXIobGFtYmRhUmVjb3JkUHJveHksIHtcbiAgICAgICAgbG9nZ2VyOiBsb2dUb0pvYixcbiAgICAgIH0pO1xuXG4gICAgICBsb2dUb0pvYihKU09OLnN0cmluZ2lmeShwcm9qZWN0Qm9keSkpO1xuXG4gICAgICBjYWxsYmFjayhudWxsLCBbdXNlckJvZHksIHByb2plY3RCb2R5XSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNhbGxiYWNrKGVycm9yKTtcbiAgICB9XG4gIH07XG5cbiAgZXhwb3J0IGRlZmF1bHQgZXhlYzsiXX0=