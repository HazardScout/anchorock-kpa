import { Context, Handler } from "aws-lambda";
import { KPAHandler, KPAOptions, WorkerStatus } from "../../base-integration/src/worker";
import { SpectrumUserJob } from "./job";
import { JobStatus } from "../../base-integration/src/job";
import { KPASpectrumConfigurationDB } from "./mongodb";
import { debuglog } from 'util';

// Handler
const exec = async (event: any, context?: Context, kpaOptions?:KPAOptions) => {
  const logger = kpaOptions?.logger || console.log;
  debuglog('log:worker:spectrum:user:env')('## ENVIRONMENT VARIABLES: ' + serialize(process.env))
  debuglog('log:worker:spectrum:user')('## EVENT: ' + serialize(event))
  debuglog('log:worker:spectrum:user')('## CONTEXT: ' + serialize(context))

  logger("Execute Spectrum User Start");
  let workerStatus = new WorkerStatus('Spectrum User Handler');

  try {
    workerStatus.start()

    const record = event.Records[0];
    const messageAttributes = record.messageAttributes;
    let userJob = new SpectrumUserJob(messageAttributes);
    let jobStatus = new JobStatus(userJob.name);
    workerStatus.jobLog.push(jobStatus);

    try {
      jobStatus.start()
      await userJob.execute(jobStatus);
    } catch (e:any) {
      jobStatus.error = {
        message: String(e),
        stack: e.stack,
      };
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

  logger("Execute Spectrum User Done");

  const response = {
    "statusCode": 200,
    "source": "Spectrum Project Integration",
    "body": workerStatus,
  }

  return response
}

var serialize = function(object: any) {
  return JSON.stringify(object, null, 2)
}

export const spectrumUserLambdaHandler : Handler = async (event: any, context: Context) => {
  return exec(event, context);
}

export const spectrumUserSyncKPAHandler : KPAHandler = async (event: any, kpaOptions: KPAOptions) => {
  const record = event.Records[0];
  const messageAttributes = record.messageAttributes;
  let kpaToken = messageAttributes['kpaToken']['stringValue'];

  const configDB = new KPASpectrumConfigurationDB();
  let config = await configDB.getConfigurationByKpaToken(kpaToken);

  const lambdaRecordProxy = {
    Records: [
      {
        messageAttributes: {
          serverUrl: {
            stringValue: `${config?.spectrumUrl}:${config?.spectrumPort}`
          },
          companyCodes: {
            stringValue: JSON.stringify(config?.companyCodes)
          },
          authorizationId: {
            stringValue: config?.authorizationId
          },
          isEditUser: {
            stringValue: !!config?.isEditUser,
          },
          kpaSite: {
            stringValue: config?.kpaSite
          },
          kpaToken: {
            stringValue: config?.kpaToken
          },
          defaultRole: {
            stringValue: config?.defaultRole,
          },
          welcomeEmail: {
            stringValue: !!config?.isWelcomeEmail,
          },
          resetPassword: {
            stringValue: !!config?.isForceResetPassword,
          },
        },
      },
    ],
  };

  return exec(lambdaRecordProxy, undefined, kpaOptions);
}
