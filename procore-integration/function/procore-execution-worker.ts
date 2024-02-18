import { Context, Handler } from "aws-lambda";
import { JobStatus } from "../../base-integration/src/job";
import { WorkerStatus } from "../../base-integration/src/worker";
import { KPAProcoreConfigurationDB } from "./mongodb";
import { ProcoreProjectJob, ProcoreUserJob } from "./job";

// Handler
export const executionLambdaHandler : Handler = async (event: any, context: Context) => {
  console.log('## ENVIRONMENT VARIABLES: ' + serialize(process.env))
  console.log('## EVENT: ' + serialize(event))
  console.log('## CONTEXT: ' + serialize(context))
  
  console.log("Execute Procore Execution Start");
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
    console.log(`Worker Stop with Error : ${e}`)
  } finally {
    workerStatus.done()
  }
  
  console.log("Execute Procore Execution Done");
  
  const response = {
    "statusCode": 200,
    "source": "Procore Execution Integration",
    "body": workerStatus,
  }
  
  return response
}

var serialize = function(object: any) {
  return JSON.stringify(object, null, 2)
}
