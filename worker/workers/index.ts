import importDir from 'shared-helpers/import-dir';
import { IWorker } from '../shared/worker-interface';

export type { IWorker } from '../shared/worker-interface';

// exports an array of IWorker type by scanning the current folder
export default importDir(__dirname, '*-worker.ts') as IWorker[];
