import { rivetProjectSyncKPAHandler } from "./rivet-project-worker";
import { rivetUserSyncKPAHandler } from "./rivet-user-worker";

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
    logToJob(`rivet-wrapper: ${lambdaRecordProxy.Records[0].messageAttributes.kpaToken.stringValue.slice(-4)}`);

    try {
      const { body: userBody } = await rivetUserSyncKPAHandler(lambdaRecordProxy, {
        logger: logToJob,
      });

      logToJob(JSON.stringify(userBody));

      const { body: projectBody } = await rivetProjectSyncKPAHandler(lambdaRecordProxy, {
        logger: logToJob,
      });

      logToJob(JSON.stringify(projectBody));

      callback(null, [userBody, projectBody]);
    } catch (error) {
      callback(error);
    }
  };

  export default exec;