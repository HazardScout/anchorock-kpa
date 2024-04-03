import { spectrumProjectSyncKPAHandler } from "./spectrum-project-worker";
import { spectrumUserSyncKPAHandler } from "./spectrum-user-worker";

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
    logToJob(`spectrum-wrapper: ${lambdaRecordProxy.Records[0].messageAttributes.kpaToken.stringValue.slice(-4)}`);
  
    try {
      const { userBody } = await spectrumUserSyncKPAHandler(lambdaRecordProxy, {
        logger: logToJob,
      });
  
      logToJob(JSON.stringify(userBody));

      const { projectBody } = await spectrumProjectSyncKPAHandler(lambdaRecordProxy, {
        logger: logToJob,
      });
  
      logToJob(JSON.stringify(projectBody));
  
      callback(null, {userSync: userBody, projectSync: projectBody});
    } catch (error) {
      callback(error);
    }
  };
  
  export default exec;