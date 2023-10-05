import 'shared-helpers/global-register';
import { runCronWorkers, runAllWorkers } from 'worker/queue';

require('dotenv').config();

runCronWorkers();

// (async () => {
//   await runAllWorkers();
// })();
