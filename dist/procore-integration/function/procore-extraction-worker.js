"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractionLambdaHandler = void 0;
const mongodb_1 = require("./mongodb");
const aws_sdk_1 = require("aws-sdk");
// Handler
const extractionLambdaHandler = async (event, context) => {
    var _a;
    console.log('## ENVIRONMENT VARIABLES: ' + serialize(process.env));
    console.log('## EVENT: ' + serialize(event));
    //Fetch Configuration
    const configDB = new mongodb_1.KPAProcoreConfigurationDB();
    let configs = await configDB.getConfiguration();
    const sqsInstance = new aws_sdk_1.SQS({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        region: process.env.AWS_REGION
    });
    for (var config of configs) {
        console.log(`Execute Procore Customer: ${config.kpaSite}} Start`);
        const sqsUserPayload = {
            DelaySeconds: 0,
            MessageBody: `User & Project Integration - ${config.kpaSite}`,
            QueueUrl: (_a = process.env.AWS_SQS_PROCORE_EXECUTOR_URL) !== null && _a !== void 0 ? _a : '',
            MessageAttributes: {
                'kpaSite': {
                    StringValue: config.kpaSite,
                    DataType: 'String'
                },
                'kpaToken': {
                    StringValue: config.kpaToken,
                    DataType: 'String'
                }
            },
        };
        const userPromise = await new Promise((resolve, reject) => {
            sqsInstance.sendMessage(sqsUserPayload, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
        console.log(userPromise);
        console.log(`Execute Procore Customer Done`);
    }
    const response = {
        "statusCode": 200,
        "source": "Procore Worker Integration",
        "body": {},
    };
    console.log(`Execute Procore Done`);
    return response;
};
exports.extractionLambdaHandler = extractionLambdaHandler;
var serialize = function (object) {
    return JSON.stringify(object, null, 2);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY29yZS1leHRyYWN0aW9uLXdvcmtlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Byb2NvcmUtaW50ZWdyYXRpb24vZnVuY3Rpb24vcHJvY29yZS1leHRyYWN0aW9uLXdvcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx1Q0FBc0Q7QUFDdEQscUNBQXdDO0FBRXhDLFVBQVU7QUFDSCxNQUFNLHVCQUF1QixHQUFhLEtBQUssRUFBRSxLQUFVLEVBQUUsT0FBZ0IsRUFBRSxFQUFFOztJQUNwRixPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtJQUNsRSxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtJQUU1QyxxQkFBcUI7SUFDckIsTUFBTSxRQUFRLEdBQUcsSUFBSSxtQ0FBeUIsRUFBRSxDQUFDO0lBQ2pELElBQUksT0FBTyxHQUFHLE1BQU0sUUFBUSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFFaEQsTUFBTSxXQUFXLEdBQUcsSUFBSSxhQUFHLENBQUM7UUFDeEIsV0FBVyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYztRQUN2QyxlQUFlLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjO1FBQzNDLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVU7S0FDakMsQ0FBQyxDQUFDO0lBRUgsS0FBSSxJQUFJLE1BQU0sSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLDZCQUE2QixNQUFNLENBQUMsT0FBTyxTQUFTLENBQUMsQ0FBQztRQUVsRSxNQUFNLGNBQWMsR0FBMkI7WUFDM0MsWUFBWSxFQUFFLENBQUM7WUFDZixXQUFXLEVBQUUsZ0NBQWdDLE1BQU0sQ0FBQyxPQUFPLEVBQUU7WUFDN0QsUUFBUSxFQUFFLE1BQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsbUNBQUksRUFBRTtZQUN4RCxpQkFBaUIsRUFBRTtnQkFDZixTQUFTLEVBQUU7b0JBQ1AsV0FBVyxFQUFFLE1BQU0sQ0FBQyxPQUFPO29CQUMzQixRQUFRLEVBQUUsUUFBUTtpQkFDckI7Z0JBQ0QsVUFBVSxFQUFFO29CQUNSLFdBQVcsRUFBRSxNQUFNLENBQUMsUUFBUTtvQkFDNUIsUUFBUSxFQUFFLFFBQVE7aUJBQ3JCO2FBQ0o7U0FDSixDQUFBO1FBRUQsTUFBTSxXQUFXLEdBQUcsTUFBTSxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUN0RCxXQUFXLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxDQUFDLEdBQWEsRUFBRSxJQUEyQixFQUFFLEVBQUU7Z0JBQ25GLElBQUksR0FBRyxFQUFFLENBQUM7b0JBQ04sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUNmLENBQUM7cUJBQU0sQ0FBQztvQkFDSixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQ2pCLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQTtRQUNOLENBQUMsQ0FBQyxDQUFBO1FBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELE1BQU0sUUFBUSxHQUFHO1FBQ2IsWUFBWSxFQUFFLEdBQUc7UUFDakIsUUFBUSxFQUFFLDRCQUE0QjtRQUN0QyxNQUFNLEVBQUUsRUFBRTtLQUNiLENBQUE7SUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUM7SUFDcEMsT0FBTyxRQUFRLENBQUE7QUFDbkIsQ0FBQyxDQUFBO0FBdkRZLFFBQUEsdUJBQXVCLDJCQXVEbkM7QUFFRCxJQUFJLFNBQVMsR0FBRyxVQUFTLE1BQVc7SUFDbEMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDeEMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29udGV4dCwgSGFuZGxlciB9IGZyb20gXCJhd3MtbGFtYmRhXCI7XG5pbXBvcnQgeyBLUEFQcm9jb3JlQ29uZmlndXJhdGlvbkRCIH0gZnJvbSBcIi4vbW9uZ29kYlwiO1xuaW1wb3J0IHsgQVdTRXJyb3IsIFNRUyB9IGZyb20gXCJhd3Mtc2RrXCI7XG5cbi8vIEhhbmRsZXJcbmV4cG9ydCBjb25zdCBleHRyYWN0aW9uTGFtYmRhSGFuZGxlciA6IEhhbmRsZXIgPSBhc3luYyAoZXZlbnQ6IGFueSwgY29udGV4dDogQ29udGV4dCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCcjIyBFTlZJUk9OTUVOVCBWQVJJQUJMRVM6ICcgKyBzZXJpYWxpemUocHJvY2Vzcy5lbnYpKVxuICAgIGNvbnNvbGUubG9nKCcjIyBFVkVOVDogJyArIHNlcmlhbGl6ZShldmVudCkpXG5cbiAgICAvL0ZldGNoIENvbmZpZ3VyYXRpb25cbiAgICBjb25zdCBjb25maWdEQiA9IG5ldyBLUEFQcm9jb3JlQ29uZmlndXJhdGlvbkRCKCk7XG4gICAgbGV0IGNvbmZpZ3MgPSBhd2FpdCBjb25maWdEQi5nZXRDb25maWd1cmF0aW9uKCk7XG4gICAgXG4gICAgY29uc3Qgc3FzSW5zdGFuY2UgPSBuZXcgU1FTKHtcbiAgICAgICAgYWNjZXNzS2V5SWQ6IHByb2Nlc3MuZW52LkFXU19BQ0NFU1NfS0VZLFxuICAgICAgICBzZWNyZXRBY2Nlc3NLZXk6IHByb2Nlc3MuZW52LkFXU19TRUNSRVRfS0VZLFxuICAgICAgICByZWdpb246IHByb2Nlc3MuZW52LkFXU19SRUdJT05cbiAgICB9KTtcblxuICAgIGZvcih2YXIgY29uZmlnIG9mIGNvbmZpZ3MpIHtcbiAgICAgICAgY29uc29sZS5sb2coYEV4ZWN1dGUgUHJvY29yZSBDdXN0b21lcjogJHtjb25maWcua3BhU2l0ZX19IFN0YXJ0YCk7XG5cbiAgICAgICAgY29uc3Qgc3FzVXNlclBheWxvYWQgOiBTUVMuU2VuZE1lc3NhZ2VSZXF1ZXN0PSB7XG4gICAgICAgICAgICBEZWxheVNlY29uZHM6IDAsXG4gICAgICAgICAgICBNZXNzYWdlQm9keTogYFVzZXIgJiBQcm9qZWN0IEludGVncmF0aW9uIC0gJHtjb25maWcua3BhU2l0ZX1gLFxuICAgICAgICAgICAgUXVldWVVcmw6IHByb2Nlc3MuZW52LkFXU19TUVNfUFJPQ09SRV9FWEVDVVRPUl9VUkwgPz8gJycsXG4gICAgICAgICAgICBNZXNzYWdlQXR0cmlidXRlczoge1xuICAgICAgICAgICAgICAgICdrcGFTaXRlJzoge1xuICAgICAgICAgICAgICAgICAgICBTdHJpbmdWYWx1ZTogY29uZmlnLmtwYVNpdGUsXG4gICAgICAgICAgICAgICAgICAgIERhdGFUeXBlOiAnU3RyaW5nJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ2twYVRva2VuJzoge1xuICAgICAgICAgICAgICAgICAgICBTdHJpbmdWYWx1ZTogY29uZmlnLmtwYVRva2VuLFxuICAgICAgICAgICAgICAgICAgICBEYXRhVHlwZTogJ1N0cmluZydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjb25zdCB1c2VyUHJvbWlzZSA9IGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHNxc0luc3RhbmNlLnNlbmRNZXNzYWdlKHNxc1VzZXJQYXlsb2FkLCAoZXJyOiBBV1NFcnJvciwgZGF0YTogU1FTLlNlbmRNZXNzYWdlUmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgICBcbiAgICAgICAgY29uc29sZS5sb2codXNlclByb21pc2UpXG4gICAgICAgIGNvbnNvbGUubG9nKGBFeGVjdXRlIFByb2NvcmUgQ3VzdG9tZXIgRG9uZWApO1xuICAgIH1cbiAgXG4gICAgY29uc3QgcmVzcG9uc2UgPSB7XG4gICAgICAgIFwic3RhdHVzQ29kZVwiOiAyMDAsXG4gICAgICAgIFwic291cmNlXCI6IFwiUHJvY29yZSBXb3JrZXIgSW50ZWdyYXRpb25cIixcbiAgICAgICAgXCJib2R5XCI6IHt9LFxuICAgIH1cbiAgXG4gICAgY29uc29sZS5sb2coYEV4ZWN1dGUgUHJvY29yZSBEb25lYCk7XG4gICAgcmV0dXJuIHJlc3BvbnNlXG59XG5cbnZhciBzZXJpYWxpemUgPSBmdW5jdGlvbihvYmplY3Q6IGFueSkge1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqZWN0LCBudWxsLCAyKVxufVxuIl19