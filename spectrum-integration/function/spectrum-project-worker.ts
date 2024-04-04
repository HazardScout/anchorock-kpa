import { Context, Handler } from "aws-lambda";
import { SpectrumProjectJob } from "./job";
import { JobStatus } from "../../base-integration/src/job";
import { KPAHandler, KPAOptions, WorkerStatus } from "../../base-integration/src/worker";
import { KPASpectrumConfigurationDB } from "./mongodb";
import { debuglog } from 'util';

// Handler
const exec = async (event: any, context?: Context, kpaOptions?:KPAOptions) => {
  const logger = kpaOptions?.logger || console.log;
  debuglog('## ENVIRONMENT VARIABLES: ' + serialize(process.env))
  debuglog('## EVENT: ' + serialize(event))
  debuglog('## CONTEXT: ' + serialize(context))

  logger("Execute Spectrum Project Start");
  let workerStatus = new WorkerStatus('Spectrum Project Handler');

  try {
    workerStatus.start()

    const record = event.Records[0];
    const messageAttributes = record.messageAttributes;
    let projectJob = new SpectrumProjectJob(messageAttributes);
    let jobStatus = new JobStatus(projectJob.name);
    workerStatus.jobLog.push(jobStatus);

    try {
      jobStatus.start()
      await projectJob.execute(jobStatus);
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

  logger("Execute Spectrum Project Done");

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

export const spectrumProjectLambdaHandler : Handler = async (event: any, context: Context) => {
  return exec(event, context);
}

export const spectrumProjectSyncKPAHandler : KPAHandler = async (event: any, kpaOptions: KPAOptions) => {

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
          isEditProject: {
            stringValue: config?.isEditProject ? '1' : '0',
          },
          kpaSite: {
            stringValue: config?.kpaSite
          },
          kpaToken: {
            stringValue: config?.kpaToken
          },
        },
      },
    ],
  };

  return exec(lambdaRecordProxy, undefined, kpaOptions);
}
