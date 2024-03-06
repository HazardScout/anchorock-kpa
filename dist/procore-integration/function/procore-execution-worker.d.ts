import { Handler } from "aws-lambda";
export declare const executionLambdaHandler: Handler;
export declare const executionKPAHandler: KPAHandler;
export type KPAOptions = {
    logger?: (...data: any[]) => void;
};
export type KPAHandler = (event: any, kpaOptions: KPAOptions) => any;
