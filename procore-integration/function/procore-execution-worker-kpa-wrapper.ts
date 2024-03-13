import { executionKPAHandler } from './procore-execution-worker';

export const exec = async (
  data:Record<string, any>,
  logToJob:(...data:any[]) => void,
  callback: (error?:any, results?:any) => void
) => {
  if (!data.apiToken) {
    return callback(new Error('apiToken is required!'));
  }

  const lambdaRecordProxy = {
    Records: [
      {
        messageAttributes: {
          kpaToken: {
            stringValue: data.apiToken
          },
        },
      },
    ],
  };
  logToJob(`procore-wrapper: ${lambdaRecordProxy.Records[0].messageAttributes.kpaToken.stringValue.slice(-4)}`);

  try {
    const { body } = await executionKPAHandler(lambdaRecordProxy, {
      logger: logToJob,
    });

    logToJob(JSON.stringify(body));

    callback(null, body);
  } catch (error) {
    callback(error);
  }
};

export default exec;
