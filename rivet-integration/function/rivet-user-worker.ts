import { Context, Handler } from "aws-lambda";
import { KPAHandler, KPAOptions, WorkerStatus } from "../../base-integration/src/worker";
import { RivetUserJob } from "./job";
import { JobStatus } from "../../base-integration/src/job";
import { KPARivetConfigurationDB } from "./mongodb";
import { debuglog } from 'util';

// Handler
const exec = async (event: any, context?: Context, kpaOptions?:KPAOptions) => {
  const logger = kpaOptions?.logger || console.log;
  debuglog('## ENVIRONMENT VARIABLES: ' + serialize(process.env))
  debuglog('## EVENT: ' + serialize(event))
  debuglog('## CONTEXT: ' + serialize(context))

  logger("Execute Rivet User Start");
  let workerStatus = new WorkerStatus('Rivet User Handler');

  try {
    workerStatus.start()

    const record = event.Records[0];
    const messageAttributes = record.messageAttributes;
    let userJob = new RivetUserJob(messageAttributes);
    let jobStatus = new JobStatus(userJob.name);
    workerStatus.jobLog.push(jobStatus);

    try {
      jobStatus.start()
      await userJob.execute(jobStatus);
    } catch (e:any) {
        jobStatus.error = {
          message: String(e),
          stack: e.stack,
        }
        throw e;
    } finally {
        jobStatus.done()
    }

  } catch(e) {
    workerStatus.error = String(e);
    logger(`Worker Stop with Unexpected Error : ${e}`);
  } finally {
    workerStatus.done()
  }

  logger("Execute Rovet User Done");

  const response = {
    "statusCode": 200,
    "source": "Rivet Project Integration",
    "body": workerStatus,
  }

  return response
}

var serialize = function(object: any) {
  return JSON.stringify(object, null, 2)
}

export const rivetUserLambdaHandler : Handler = async (event: any, context: Context) => {
  return exec(event, context);
}

export const rivetUserSyncKPAHandler : KPAHandler = async (event: any, kpaOptions: KPAOptions) => {
  const record = event.Records[0];
  const messageAttributes = record.messageAttributes;
  let kpaToken = messageAttributes['kpaToken']['stringValue'];

  const configDB = new KPARivetConfigurationDB();
  let config = await configDB.getConfigurationByKpaToken(kpaToken);

  const lambdaRecordProxy = {
    Records: [
      {
        messageAttributes: {
          clientId: {
            stringValue: config?.clientId
          },
          token: {
            stringValue: config?.token
          },
          isEditUser: {
            stringValue: config?.isEditUser ? '1' : '0',
          },
          kpaSite: {
            stringValue: config?.kpaSite
          },
          kpaToken: {
            stringValue: config?.kpaToken
          },
          defaultRole: {
            stringValue: config?.defaultRole ? '1' : '0',
          },
          welcomeEmail: {
            stringValue: config?.isWelcomeEmail ? '1' : '0',
          },
          resetPassword: {
            stringValue: config?.isForceResetPassword ? '1' : '0',
          },
        },
      },
    ],
  };

  return exec(lambdaRecordProxy, undefined, kpaOptions);
}
