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
        if (!config.active) {
            continue;
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY29yZS1leHRyYWN0aW9uLXdvcmtlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Byb2NvcmUtaW50ZWdyYXRpb24vZnVuY3Rpb24vcHJvY29yZS1leHRyYWN0aW9uLXdvcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx1Q0FBc0Q7QUFDdEQscUNBQXdDO0FBRXhDLFVBQVU7QUFDSCxNQUFNLHVCQUF1QixHQUFhLEtBQUssRUFBRSxLQUFVLEVBQUUsT0FBZ0IsRUFBRSxFQUFFOztJQUNwRixPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtJQUNsRSxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtJQUU1QyxxQkFBcUI7SUFDckIsTUFBTSxRQUFRLEdBQUcsSUFBSSxtQ0FBeUIsRUFBRSxDQUFDO0lBQ2pELElBQUksT0FBTyxHQUFHLE1BQU0sUUFBUSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFFaEQsTUFBTSxXQUFXLEdBQUcsSUFBSSxhQUFHLENBQUM7UUFDeEIsV0FBVyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYztRQUN2QyxlQUFlLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjO1FBQzNDLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVU7S0FDakMsQ0FBQyxDQUFDO0lBRUgsS0FBSSxJQUFJLE1BQU0sSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2pCLFNBQVM7UUFDYixDQUFDO1FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsTUFBTSxDQUFDLE9BQU8sU0FBUyxDQUFDLENBQUM7UUFFbEUsTUFBTSxjQUFjLEdBQTJCO1lBQzNDLFlBQVksRUFBRSxDQUFDO1lBQ2YsV0FBVyxFQUFFLGdDQUFnQyxNQUFNLENBQUMsT0FBTyxFQUFFO1lBQzdELFFBQVEsRUFBRSxNQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLG1DQUFJLEVBQUU7WUFDeEQsaUJBQWlCLEVBQUU7Z0JBQ2YsU0FBUyxFQUFFO29CQUNQLFdBQVcsRUFBRSxNQUFNLENBQUMsT0FBTztvQkFDM0IsUUFBUSxFQUFFLFFBQVE7aUJBQ3JCO2dCQUNELFVBQVUsRUFBRTtvQkFDUixXQUFXLEVBQUUsTUFBTSxDQUFDLFFBQVE7b0JBQzVCLFFBQVEsRUFBRSxRQUFRO2lCQUNyQjthQUNKO1NBQ0osQ0FBQTtRQUVELE1BQU0sV0FBVyxHQUFHLE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDdEQsV0FBVyxDQUFDLFdBQVcsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxHQUFhLEVBQUUsSUFBMkIsRUFBRSxFQUFFO2dCQUNuRixJQUFJLEdBQUcsRUFBRSxDQUFDO29CQUNOLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDZixDQUFDO3FCQUFNLENBQUM7b0JBQ0osT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO2dCQUNqQixDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUE7UUFDTixDQUFDLENBQUMsQ0FBQTtRQUVGLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxNQUFNLFFBQVEsR0FBRztRQUNiLFlBQVksRUFBRSxHQUFHO1FBQ2pCLFFBQVEsRUFBRSw0QkFBNEI7UUFDdEMsTUFBTSxFQUFFLEVBQUU7S0FDYixDQUFBO0lBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQ3BDLE9BQU8sUUFBUSxDQUFBO0FBQ25CLENBQUMsQ0FBQTtBQTFEWSxRQUFBLHVCQUF1QiwyQkEwRG5DO0FBRUQsSUFBSSxTQUFTLEdBQUcsVUFBUyxNQUFXO0lBQ2xDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ3hDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnRleHQsIEhhbmRsZXIgfSBmcm9tIFwiYXdzLWxhbWJkYVwiO1xuaW1wb3J0IHsgS1BBUHJvY29yZUNvbmZpZ3VyYXRpb25EQiB9IGZyb20gXCIuL21vbmdvZGJcIjtcbmltcG9ydCB7IEFXU0Vycm9yLCBTUVMgfSBmcm9tIFwiYXdzLXNka1wiO1xuXG4vLyBIYW5kbGVyXG5leHBvcnQgY29uc3QgZXh0cmFjdGlvbkxhbWJkYUhhbmRsZXIgOiBIYW5kbGVyID0gYXN5bmMgKGV2ZW50OiBhbnksIGNvbnRleHQ6IENvbnRleHQpID0+IHtcbiAgICBjb25zb2xlLmxvZygnIyMgRU5WSVJPTk1FTlQgVkFSSUFCTEVTOiAnICsgc2VyaWFsaXplKHByb2Nlc3MuZW52KSlcbiAgICBjb25zb2xlLmxvZygnIyMgRVZFTlQ6ICcgKyBzZXJpYWxpemUoZXZlbnQpKVxuXG4gICAgLy9GZXRjaCBDb25maWd1cmF0aW9uXG4gICAgY29uc3QgY29uZmlnREIgPSBuZXcgS1BBUHJvY29yZUNvbmZpZ3VyYXRpb25EQigpO1xuICAgIGxldCBjb25maWdzID0gYXdhaXQgY29uZmlnREIuZ2V0Q29uZmlndXJhdGlvbigpO1xuICAgIFxuICAgIGNvbnN0IHNxc0luc3RhbmNlID0gbmV3IFNRUyh7XG4gICAgICAgIGFjY2Vzc0tleUlkOiBwcm9jZXNzLmVudi5BV1NfQUNDRVNTX0tFWSxcbiAgICAgICAgc2VjcmV0QWNjZXNzS2V5OiBwcm9jZXNzLmVudi5BV1NfU0VDUkVUX0tFWSxcbiAgICAgICAgcmVnaW9uOiBwcm9jZXNzLmVudi5BV1NfUkVHSU9OXG4gICAgfSk7XG5cbiAgICBmb3IodmFyIGNvbmZpZyBvZiBjb25maWdzKSB7XG4gICAgICAgIGlmICghY29uZmlnLmFjdGl2ZSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coYEV4ZWN1dGUgUHJvY29yZSBDdXN0b21lcjogJHtjb25maWcua3BhU2l0ZX19IFN0YXJ0YCk7XG5cbiAgICAgICAgY29uc3Qgc3FzVXNlclBheWxvYWQgOiBTUVMuU2VuZE1lc3NhZ2VSZXF1ZXN0PSB7XG4gICAgICAgICAgICBEZWxheVNlY29uZHM6IDAsXG4gICAgICAgICAgICBNZXNzYWdlQm9keTogYFVzZXIgJiBQcm9qZWN0IEludGVncmF0aW9uIC0gJHtjb25maWcua3BhU2l0ZX1gLFxuICAgICAgICAgICAgUXVldWVVcmw6IHByb2Nlc3MuZW52LkFXU19TUVNfUFJPQ09SRV9FWEVDVVRPUl9VUkwgPz8gJycsXG4gICAgICAgICAgICBNZXNzYWdlQXR0cmlidXRlczoge1xuICAgICAgICAgICAgICAgICdrcGFTaXRlJzoge1xuICAgICAgICAgICAgICAgICAgICBTdHJpbmdWYWx1ZTogY29uZmlnLmtwYVNpdGUsXG4gICAgICAgICAgICAgICAgICAgIERhdGFUeXBlOiAnU3RyaW5nJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ2twYVRva2VuJzoge1xuICAgICAgICAgICAgICAgICAgICBTdHJpbmdWYWx1ZTogY29uZmlnLmtwYVRva2VuLFxuICAgICAgICAgICAgICAgICAgICBEYXRhVHlwZTogJ1N0cmluZydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjb25zdCB1c2VyUHJvbWlzZSA9IGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHNxc0luc3RhbmNlLnNlbmRNZXNzYWdlKHNxc1VzZXJQYXlsb2FkLCAoZXJyOiBBV1NFcnJvciwgZGF0YTogU1FTLlNlbmRNZXNzYWdlUmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgICBcbiAgICAgICAgY29uc29sZS5sb2codXNlclByb21pc2UpXG4gICAgICAgIGNvbnNvbGUubG9nKGBFeGVjdXRlIFByb2NvcmUgQ3VzdG9tZXIgRG9uZWApO1xuICAgIH1cbiAgXG4gICAgY29uc3QgcmVzcG9uc2UgPSB7XG4gICAgICAgIFwic3RhdHVzQ29kZVwiOiAyMDAsXG4gICAgICAgIFwic291cmNlXCI6IFwiUHJvY29yZSBXb3JrZXIgSW50ZWdyYXRpb25cIixcbiAgICAgICAgXCJib2R5XCI6IHt9LFxuICAgIH1cbiAgXG4gICAgY29uc29sZS5sb2coYEV4ZWN1dGUgUHJvY29yZSBEb25lYCk7XG4gICAgcmV0dXJuIHJlc3BvbnNlXG59XG5cbnZhciBzZXJpYWxpemUgPSBmdW5jdGlvbihvYmplY3Q6IGFueSkge1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqZWN0LCBudWxsLCAyKVxufVxuIl19