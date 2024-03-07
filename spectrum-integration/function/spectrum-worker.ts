import { Context, Handler } from "aws-lambda";
import { KPASpectrumConfigurationDB } from "./mongodb";
import { AWSError, SQS } from "aws-sdk";

// Handler
export const workerLambdaHandler : Handler = async (event: any, context: Context) => {
    console.log('## ENVIRONMENT VARIABLES: ' + serialize(process.env))
    console.log('## EVENT: ' + serialize(event))

    //Fetch Configuration
    const configDB = new KPASpectrumConfigurationDB();
    let configs = await configDB.getConfiguration();

    const sqsInstance = new SQS({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        region: process.env.AWS_REGION
    });

    for(var config of configs) {
        if (!config.active) {
            continue;
        }
        console.log(`Execute Spectrum Customer: ${config.kpaSite} ${config.clientId} ${config.clientSecret} Start`);

        if (config.isSyncUser) {
            const sqsUserPayload : SQS.SendMessageRequest= {
                DelaySeconds: 0,
                MessageBody: `User Integration - ${config.kpaSite}`,
                QueueUrl: process.env.AWS_SQS_SPECTRUM_USER_URL ?? '',
                MessageAttributes: {
                    'clientId': {
                        StringValue: config.clientId,
                        DataType: 'String'
                    },
                    'clientSecret': {
                        StringValue: config.clientSecret,
                        DataType: 'String'
                    },
                    'isEditUser': {
                        StringValue: config.isEditUser ? '1' : '0',
                        DataType: 'String'
                    },
                    'kpaSite': {
                        StringValue: config.kpaSite,
                        DataType: 'String'
                    },
                    'kpaToken': {
                        StringValue: config.kpaToken,
                        DataType: 'String'
                    },
                    'defaultRole': {
                        StringValue: config.defaultRole,
                        DataType: 'String'
                    },
                    'welcomeEmail': {
                        StringValue: config.isWelcomeEmail ? '1' : '0',
                        DataType: 'String'
                    },
                    'resetPassword': {
                        StringValue: config.isForceResetPassword ? '1' : '0',
                        DataType: 'String'
                    }
                },
            }
            
            const userPromise = await new Promise((resolve, reject) => {
                sqsInstance.sendMessage(sqsUserPayload, (err: AWSError, data: SQS.SendMessageResult) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(data)
                    }
                })
            })
            console.log(userPromise)
        }

        if (config.isSyncProject) {
            const sqsProjectPayload : SQS.SendMessageRequest= {
                DelaySeconds: 0,
                MessageBody: `Project Integration - ${config.kpaSite}`,
                QueueUrl: process.env.AWS_SQS_SPECTRUM_PROJECT_URL ?? '',
                MessageAttributes: {
                    'clientId': {
                        StringValue: config.clientId,
                        DataType: 'String'
                    },
                    'clientSecret': {
                        StringValue: config.clientSecret,
                        DataType: 'String'
                    },
                    'isEditProject': {
                        StringValue: config.isEditProject ? '1' : '0',
                        DataType: 'String'
                    },
                    'kpaSite': {
                        StringValue: config.kpaSite,
                        DataType: 'String'
                    },
                    'kpaToken': {
                        StringValue: config.kpaToken,
                        DataType: 'String'
                    }
                },
            }
            
            const projectPromise = await new Promise((resolve, reject) => {
                sqsInstance.sendMessage(sqsProjectPayload, (err: AWSError, data: SQS.SendMessageResult) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(data)
                    }
                })
            })
            
            console.log(projectPromise)
        }

        console.log(`Execute Spectrum Customer Done`);
    }
  
    const response = {
        "statusCode": 200,
        "source": "Spectrum Worker Integration",
        "body": {},
    }
  
    console.log(`Execute Spectrum Done`);
    return response
}

var serialize = function(object: any) {
  return JSON.stringify(object, null, 2)
}
