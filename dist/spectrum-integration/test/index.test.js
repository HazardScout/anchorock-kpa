"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const spectrum_worker_1 = require("spectrum/function/spectrum-worker");
const spectrum_user_worker_1 = require("spectrum/function/spectrum-user-worker");
const spectrum_project_worker_1 = require("spectrum/function/spectrum-project-worker");
const globals_1 = require("@jest/globals");
require('dotenv').config();
(0, globals_1.describe)('running-test', () => {
    (0, globals_1.describe)('lambda', () => {
        const event = { headers: {} };
        const context = { functionVersion: '$LATEST' };
        const callback = {};
        (0, globals_1.it)('worker-handler', async () => {
            const event = {};
            const result = await (0, spectrum_worker_1.workerLambdaHandler)(event, context, callback);
            (0, globals_1.expect)(result.statusCode).toBe(200);
        }, 300000);
        (0, globals_1.it)('user-handler', async () => {
            let eventFile = (0, fs_1.readFileSync)('event-user.json', 'utf8');
            let event = JSON.parse(eventFile);
            const result = await (0, spectrum_user_worker_1.spectrumUserLambdaHandler)(event, context, callback);
            (0, globals_1.expect)(result.statusCode).toBe(200);
        }, 300000);
        (0, globals_1.it)('project-handler', async () => {
            let eventFile = (0, fs_1.readFileSync)('event-project.json', 'utf8');
            let event = JSON.parse(eventFile);
            const result = await (0, spectrum_project_worker_1.spectrumProjectLambdaHandler)(event, context, callback);
            (0, globals_1.expect)(result.statusCode).toBe(200);
        }, 300000);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NwZWN0cnVtLWludGVncmF0aW9uL3Rlc3QvaW5kZXgudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJCQUFrQztBQUNsQyx1RUFBd0U7QUFDeEUsaUZBQW1GO0FBQ25GLHVGQUF5RjtBQUN6RiwyQ0FJdUI7QUFFdkIsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRTNCLElBQUEsa0JBQVEsRUFBQyxjQUFjLEVBQUUsR0FBRyxFQUFFO0lBRTVCLElBQUEsa0JBQVEsRUFBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO1FBQ3RCLE1BQU0sS0FBSyxHQUFRLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBQyxDQUFDO1FBQ2xDLE1BQU0sT0FBTyxHQUFRLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxDQUFDO1FBQ3BELE1BQU0sUUFBUSxHQUFRLEVBQUUsQ0FBQztRQUV6QixJQUFBLFlBQUUsRUFBQyxnQkFBZ0IsRUFBRSxLQUFLLElBQUksRUFBRTtZQUM5QixNQUFNLEtBQUssR0FBRyxFQUFFLENBQUE7WUFDaEIsTUFBTSxNQUFNLEdBQVEsTUFBTSxJQUFBLHFDQUFtQixFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDeEUsSUFBQSxnQkFBTSxFQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBRVYsSUFBQSxZQUFFLEVBQUMsY0FBYyxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQzVCLElBQUksU0FBUyxHQUFHLElBQUEsaUJBQVksRUFBQyxpQkFBaUIsRUFBQyxNQUFNLENBQUMsQ0FBQTtZQUN0RCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBQ2pDLE1BQU0sTUFBTSxHQUFRLE1BQU0sSUFBQSxnREFBeUIsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzlFLElBQUEsZ0JBQU0sRUFBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUdWLElBQUEsWUFBRSxFQUFDLGlCQUFpQixFQUFFLEtBQUssSUFBSSxFQUFFO1lBQy9CLElBQUksU0FBUyxHQUFHLElBQUEsaUJBQVksRUFBQyxvQkFBb0IsRUFBQyxNQUFNLENBQUMsQ0FBQTtZQUN6RCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBQ2pDLE1BQU0sTUFBTSxHQUFRLE1BQU0sSUFBQSxzREFBNEIsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ2pGLElBQUEsZ0JBQU0sRUFBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQTtJQUVaLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZWFkRmlsZVN5bmMgfSBmcm9tIFwiZnNcIjtcbmltcG9ydCB7IHdvcmtlckxhbWJkYUhhbmRsZXIgfSBmcm9tIFwic3BlY3RydW0vZnVuY3Rpb24vc3BlY3RydW0td29ya2VyXCI7XG5pbXBvcnQgeyBzcGVjdHJ1bVVzZXJMYW1iZGFIYW5kbGVyIH0gZnJvbSBcInNwZWN0cnVtL2Z1bmN0aW9uL3NwZWN0cnVtLXVzZXItd29ya2VyXCI7XG5pbXBvcnQgeyBzcGVjdHJ1bVByb2plY3RMYW1iZGFIYW5kbGVyIH0gZnJvbSBcInNwZWN0cnVtL2Z1bmN0aW9uL3NwZWN0cnVtLXByb2plY3Qtd29ya2VyXCI7XG5pbXBvcnQge1xuICBkZXNjcmliZSxcbiAgaXQsXG4gIGV4cGVjdCxcbn0gZnJvbSAnQGplc3QvZ2xvYmFscyc7XG5cbnJlcXVpcmUoJ2RvdGVudicpLmNvbmZpZygpO1xuXG5kZXNjcmliZSgncnVubmluZy10ZXN0JywgKCkgPT4ge1xuXG4gIGRlc2NyaWJlKCdsYW1iZGEnLCAoKSA9PiB7XG4gICAgY29uc3QgZXZlbnQ6IGFueSA9IHsgaGVhZGVyczoge319O1xuICAgIGNvbnN0IGNvbnRleHQ6IGFueSA9IHsgZnVuY3Rpb25WZXJzaW9uOiAnJExBVEVTVCcgfTtcbiAgICBjb25zdCBjYWxsYmFjazogYW55ID0ge307XG5cbiAgICBpdCgnd29ya2VyLWhhbmRsZXInLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBldmVudCA9IHt9XG4gICAgICBjb25zdCByZXN1bHQ6IGFueSA9IGF3YWl0IHdvcmtlckxhbWJkYUhhbmRsZXIoZXZlbnQsIGNvbnRleHQsIGNhbGxiYWNrKTtcbiAgICAgIGV4cGVjdChyZXN1bHQuc3RhdHVzQ29kZSkudG9CZSgyMDApO1xuICAgIH0sIDMwMDAwMClcblxuICAgIGl0KCd1c2VyLWhhbmRsZXInLCBhc3luYyAoKSA9PiB7XG4gICAgICBsZXQgZXZlbnRGaWxlID0gcmVhZEZpbGVTeW5jKCdldmVudC11c2VyLmpzb24nLCd1dGY4JylcbiAgICAgIGxldCBldmVudCA9IEpTT04ucGFyc2UoZXZlbnRGaWxlKVxuICAgICAgY29uc3QgcmVzdWx0OiBhbnkgPSBhd2FpdCBzcGVjdHJ1bVVzZXJMYW1iZGFIYW5kbGVyKGV2ZW50LCBjb250ZXh0LCBjYWxsYmFjayk7XG4gICAgICBleHBlY3QocmVzdWx0LnN0YXR1c0NvZGUpLnRvQmUoMjAwKTtcbiAgICB9LCAzMDAwMDApXG5cblxuICAgIGl0KCdwcm9qZWN0LWhhbmRsZXInLCBhc3luYyAoKSA9PiB7XG4gICAgICBsZXQgZXZlbnRGaWxlID0gcmVhZEZpbGVTeW5jKCdldmVudC1wcm9qZWN0Lmpzb24nLCd1dGY4JylcbiAgICAgIGxldCBldmVudCA9IEpTT04ucGFyc2UoZXZlbnRGaWxlKVxuICAgICAgY29uc3QgcmVzdWx0OiBhbnkgPSBhd2FpdCBzcGVjdHJ1bVByb2plY3RMYW1iZGFIYW5kbGVyKGV2ZW50LCBjb250ZXh0LCBjYWxsYmFjayk7XG4gICAgICBleHBlY3QocmVzdWx0LnN0YXR1c0NvZGUpLnRvQmUoMjAwKTtcbiAgICB9LCAzMDAwMDApXG5cbiAgfSlcbn0pXG4iXX0=