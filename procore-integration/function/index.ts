import { Context, Handler } from "aws-lambda";

// Handler
export const lambdaHandler : Handler = async (event: any, context: Context) => {
  console.log('## ENVIRONMENT VARIABLES: ' + serialize(process.env))
  console.log('## EVENT: ' + serialize(event))

  
  const response = {
    "statusCode": 200,
    "source": "Sample Integration",
    "body": {},
  }
  
  return response
}

var serialize = function(object: any) {
  return JSON.stringify(object, null, 2)
}
