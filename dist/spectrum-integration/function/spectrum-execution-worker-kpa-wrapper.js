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
        const { userBody } = await (0, spectrum_user_worker_1.spectrumUserSyncKPAHandler)(lambdaRecordProxy, {
            logger: logToJob,
        });
        logToJob(JSON.stringify(userBody));
        const { projectBody } = await (0, spectrum_project_worker_1.spectrumProjectSyncKPAHandler)(lambdaRecordProxy, {
            logger: logToJob,
        });
        logToJob(JSON.stringify(projectBody));
        callback(null, { userSync: userBody, projectSync: projectBody });
    }
    catch (error) {
        callback(error);
    }
};
exports.exec = exec;
exports.default = exports.exec;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlY3RydW0tZXhlY3V0aW9uLXdvcmtlci1rcGEtd3JhcHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NwZWN0cnVtLWludGVncmF0aW9uL2Z1bmN0aW9uL3NwZWN0cnVtLWV4ZWN1dGlvbi13b3JrZXIta3BhLXdyYXBwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsdUVBQTBFO0FBQzFFLGlFQUFvRTtBQUU3RCxNQUFNLElBQUksR0FBRyxLQUFLLEVBQ3JCLElBQXdCLEVBQ3hCLFFBQWdDLEVBQ2hDLFFBQTRDLEVBQzVDLEVBQUU7SUFDRixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ25CLE9BQU8sUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsTUFBTSxpQkFBaUIsR0FBRztRQUN4QixPQUFPLEVBQUU7WUFDUDtnQkFDRSxpQkFBaUIsRUFBRTtvQkFDakIsUUFBUSxFQUFFO3dCQUNSLFdBQVcsRUFBRSxJQUFJLENBQUMsUUFBUTtxQkFDM0I7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0YsQ0FBQztJQUNGLFFBQVEsQ0FBQyxxQkFBcUIsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRS9HLElBQUksQ0FBQztRQUNILE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxNQUFNLElBQUEsaURBQTBCLEVBQUMsaUJBQWlCLEVBQUU7WUFDdkUsTUFBTSxFQUFFLFFBQVE7U0FDakIsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUVuQyxNQUFNLEVBQUUsV0FBVyxFQUFFLEdBQUcsTUFBTSxJQUFBLHVEQUE2QixFQUFDLGlCQUFpQixFQUFFO1lBQzdFLE1BQU0sRUFBRSxRQUFRO1NBQ2pCLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFFdEMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBQyxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEIsQ0FBQztBQUNILENBQUMsQ0FBQztBQXZDUyxRQUFBLElBQUksUUF1Q2I7QUFFRixrQkFBZSxZQUFJLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBzcGVjdHJ1bVByb2plY3RTeW5jS1BBSGFuZGxlciB9IGZyb20gXCIuL3NwZWN0cnVtLXByb2plY3Qtd29ya2VyXCI7XG5pbXBvcnQgeyBzcGVjdHJ1bVVzZXJTeW5jS1BBSGFuZGxlciB9IGZyb20gXCIuL3NwZWN0cnVtLXVzZXItd29ya2VyXCI7XG5cbmV4cG9ydCBjb25zdCBleGVjID0gYXN5bmMgKFxuICAgIGRhdGE6UmVjb3JkPHN0cmluZywgYW55PixcbiAgICBsb2dUb0pvYjooLi4uZGF0YTphbnlbXSkgPT4gdm9pZCxcbiAgICBjYWxsYmFjazogKGVycm9yPzphbnksIHJlc3VsdHM/OmFueSkgPT4gdm9pZFxuICApID0+IHtcbiAgICBpZiAoIWRhdGEuYXBpVG9rZW4pIHtcbiAgICAgIHJldHVybiBjYWxsYmFjayhuZXcgRXJyb3IoJ2FwaVRva2VuIGlzIHJlcXVpcmVkIScpKTtcbiAgICB9XG4gIFxuICAgIGNvbnN0IGxhbWJkYVJlY29yZFByb3h5ID0ge1xuICAgICAgUmVjb3JkczogW1xuICAgICAgICB7XG4gICAgICAgICAgbWVzc2FnZUF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgIGtwYVRva2VuOiB7XG4gICAgICAgICAgICAgIHN0cmluZ1ZhbHVlOiBkYXRhLmFwaVRva2VuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH07XG4gICAgbG9nVG9Kb2IoYHNwZWN0cnVtLXdyYXBwZXI6ICR7bGFtYmRhUmVjb3JkUHJveHkuUmVjb3Jkc1swXS5tZXNzYWdlQXR0cmlidXRlcy5rcGFUb2tlbi5zdHJpbmdWYWx1ZS5zbGljZSgtNCl9YCk7XG4gIFxuICAgIHRyeSB7XG4gICAgICBjb25zdCB7IHVzZXJCb2R5IH0gPSBhd2FpdCBzcGVjdHJ1bVVzZXJTeW5jS1BBSGFuZGxlcihsYW1iZGFSZWNvcmRQcm94eSwge1xuICAgICAgICBsb2dnZXI6IGxvZ1RvSm9iLFxuICAgICAgfSk7XG4gIFxuICAgICAgbG9nVG9Kb2IoSlNPTi5zdHJpbmdpZnkodXNlckJvZHkpKTtcblxuICAgICAgY29uc3QgeyBwcm9qZWN0Qm9keSB9ID0gYXdhaXQgc3BlY3RydW1Qcm9qZWN0U3luY0tQQUhhbmRsZXIobGFtYmRhUmVjb3JkUHJveHksIHtcbiAgICAgICAgbG9nZ2VyOiBsb2dUb0pvYixcbiAgICAgIH0pO1xuICBcbiAgICAgIGxvZ1RvSm9iKEpTT04uc3RyaW5naWZ5KHByb2plY3RCb2R5KSk7XG4gIFxuICAgICAgY2FsbGJhY2sobnVsbCwge3VzZXJTeW5jOiB1c2VyQm9keSwgcHJvamVjdFN5bmM6IHByb2plY3RCb2R5fSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNhbGxiYWNrKGVycm9yKTtcbiAgICB9XG4gIH07XG4gIFxuICBleHBvcnQgZGVmYXVsdCBleGVjOyJdfQ==