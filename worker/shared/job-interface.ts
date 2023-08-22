export interface IJob {
    name:string,
    execute(): Promise<void>,
}