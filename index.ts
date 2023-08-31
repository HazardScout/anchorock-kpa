import 'shared-helpers/global-register';
import { runAllWorkers } from 'worker/queue';

require('dotenv').config();

(async () => {
  await runAllWorkers();
})();
