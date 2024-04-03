import { Context, Handler } from "aws-lambda";
import { RivetProjectJob } from "./job";
import { JobStatus } from "../../base-integration/src/job";
import { KPAHandler, KPAOptions, WorkerStatus } from "../../base-integration/src/worker";
import { KPARivetConfigurationDB } from "./mongodb";
import { debuglog } from 'util';

// Handler
const exec = async (event: any, context?: Context, kpaOptions?:KPAOptions) => {
  const logger = kpaOptions?.logger || console.log;
  debuglog('## ENVIRONMENT VARIABLES: ' + serialize(process.env))
  debuglog('## EVENT: ' + serialize(event))
  debuglog('## CONTEXT: ' + serialize(context))
  
  logger("Execute Rivet Project Start");
  let workerStatus = new WorkerStatus('Rivet Project Handler');
  
  try {
    workerStatus.start()

    const record = event.Records[0];
    const messageAttributes = record.messageAttributes;
    let projectJob = new RivetProjectJob(messageAttributes);
    let jobStatus = new JobStatus(projectJob.name);
    workerStatus.jobLog.push(jobStatus);

    try {
      jobStatus.start()
      await projectJob.execute(jobStatus);
    } catch (e) {
        jobStatus.error = String(e)
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
  
  logger("Execute Rivet Project Done");
  
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

export const rivetProjectLambdaHandler : Handler = async (event: any, context: Context) => {
  return exec(event, context);
}

export const rivetProjectSyncKPAHandler : KPAHandler = async (event: any, kpaOptions: KPAOptions) => {

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
