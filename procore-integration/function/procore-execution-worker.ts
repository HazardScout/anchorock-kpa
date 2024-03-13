import { Context, Handler } from "aws-lambda";
import { debuglog } from 'util';
import { JobStatus } from "../../base-integration/src/job";
import { WorkerStatus } from "../../base-integration/src/worker";
import { KPAProcoreConfigurationDB } from "./mongodb";
import { ProcoreProjectJob, ProcoreUserJob } from "./job";

const exec = async (event: any, context?: Context, kpaOptions?:KPAOptions) => {
  const logger = kpaOptions?.logger || console.log;
  debuglog('env')('## ENVIRONMENT VARIABLES: ' + serialize(process.env))
  logger('## EVENT: ' + serialize(event))
  logger('## CONTEXT: ' + serialize(context || kpaOptions))

  logger("Execute Procore Execution Start");
  let workerStatus = new WorkerStatus('Procore Execution Handler');

  try {
    workerStatus.start()
    const record = event.Records[0];
    const messageAttributes = record.messageAttributes;

    // let kpaToken = `${messageAttributes.get('kpaToken')?.get('stringValue')}`;
    let kpaToken = messageAttributes['kpaToken']['stringValue'];

    const configDB = new KPAProcoreConfigurationDB();
    let config = await configDB.getConfigurationByKpaToken(kpaToken);

    if (config != null) {
      if (config.isSyncUser) {
        let userJob = new ProcoreUserJob(config);
        let jobStatus = new JobStatus(userJob.name);
        workerStatus.jobLog.push(jobStatus);

        try {
          jobStatus.start()
          await userJob.execute(jobStatus);
        } catch (e) {
            jobStatus.error = String(e)
            throw e;
        } finally {
            jobStatus.done()
        }
      }

      if (config.isSyncProject) {
        let projectJob = new ProcoreProjectJob(config);
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
      }
    }


  } catch(e) {
    workerStatus.error = String(e);
    logger(`Worker Stop with Error : ${{ msg: String(e), stack: e.stack }}`)
  } finally {
    workerStatus.done()
  }

  logger("Execute Procore Execution Done");

  const response = {
    "statusCode": 200,
    "source": "Procore Execution Integration",
    "body": workerStatus,
  }

  return response
}

export const executionLambdaHandler : Handler = async (event: any, context: Context) => {
  return exec(event, context);
}

export const executionKPAHandler : KPAHandler = async (event: any, kpaOptions: KPAOptions) => {
  return exec(event, undefined, kpaOptions);
}

const serialize = function(object: any) {
  return JSON.stringify(object, null, 2)
}

export type KPAOptions = {
  logger?: (...data:any[]) => void,
}

export type KPAHandler = (event: any, kpaOptions:KPAOptions) => any;
