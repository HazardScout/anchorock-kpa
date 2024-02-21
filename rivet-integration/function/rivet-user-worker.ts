import { Context, Handler } from "aws-lambda";
import { WorkerStatus } from "../../base-integration/src/worker";
import { RivetUserJob } from "./job";
import { JobStatus } from "../../base-integration/src/job";

// Handler
export const rivetUserLambdaHandler : Handler = async (event: any, context: Context) => {
  console.log('## ENVIRONMENT VARIABLES: ' + serialize(process.env))
  console.log('## EVENT: ' + serialize(event))
  console.log('## CONTEXT: ' + serialize(context))
  
  console.log("Execute Rivet User Start");
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
    } catch (e) {
        jobStatus.error = String(e)
        throw e;
    } finally {
        jobStatus.done()
    }
    
  } catch(e) {
    workerStatus.error = String(e);
    console.log(`Worker Stop with Error : ${e}`)
  } finally {
    workerStatus.done()
  }
  
  console.log("Execute Spectrum User Done");
  
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
