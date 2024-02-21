import { Context, Handler } from "aws-lambda";
import { RivetProjectJob } from "./job";
import { JobStatus } from "../../base-integration/src/job";
import { WorkerStatus } from "../../base-integration/src/worker";

// Handler
export const rivetProjectLambdaHandler : Handler = async (event: any, context: Context) => {
  console.log('## ENVIRONMENT VARIABLES: ' + serialize(process.env))
  console.log('## EVENT: ' + serialize(event))
  console.log('## CONTEXT: ' + serialize(context))
  
  console.log("Execute Rivet Project Start");
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
    console.log(`Worker Stop with Error : ${e}`)
  } finally {
    workerStatus.done()
  }
  
  console.log("Execute Rivet Project Done");
  
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
