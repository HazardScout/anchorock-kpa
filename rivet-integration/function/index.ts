import { Context, Handler } from "aws-lambda";
import { WorkerStatus } from "./base-integration/worker";
import { RivetWorker } from "./worker/rivet-worker";

// Handler
export const lambdaHandler : Handler = async (event: any, context: Context) => {
  console.log('## ENVIRONMENT VARIABLES: ' + serialize(process.env))
  console.log('## EVENT: ' + serialize(event))

  const worker = new RivetWorker()
  const workerStatus = new WorkerStatus(worker.name)

  try {
    workerStatus.start();
    await worker.execute(workerStatus);
  } catch (error) {
    workerStatus.error = String(error);
  } finally {
    workerStatus.done();
  }
  
  console.log(workerStatus)
  const response = {
    "statusCode": 200,
    "source": "Rivet Integration",
    "body": workerStatus,
  }
  
  return response
}

var serialize = function(object: any) {
  return JSON.stringify(object, null, 2)
}
