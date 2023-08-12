import 'shared-helpers/global-register';
import { runAllWorkers } from 'worker/queue';

(async () => {
  await runAllWorkers();
})();
