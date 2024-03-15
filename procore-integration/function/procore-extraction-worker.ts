import { Context, Handler } from "aws-lambda";
import { KPAProcoreConfigurationDB } from "./mongodb";
import { AWSError, SQS } from "aws-sdk";

// Handler
export const extractionLambdaHandler : Handler = async (event: any, context: Context) => {
    console.log('## ENVIRONMENT VARIABLES: ' + serialize(process.env))
    console.log('## EVENT: ' + serialize(event))

    //Fetch Configuration
    const configDB = new KPAProcoreConfigurationDB();
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
        console.log(`Execute Procore Customer: ${config.kpaSite}} Start`);

        const sqsUserPayload : SQS.SendMessageRequest= {
            DelaySeconds: 0,
            MessageBody: `User & Project Integration - ${config.kpaSite}`,
            QueueUrl: process.env.AWS_SQS_PROCORE_EXECUTOR_URL ?? '',
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
        console.log(`Execute Procore Customer Done`);
    }
  
    const response = {
        "statusCode": 200,
        "source": "Procore Worker Integration",
        "body": {},
    }
  
    console.log(`Execute Procore Done`);
    return response
}

var serialize = function(object: any) {
  return JSON.stringify(object, null, 2)
}
