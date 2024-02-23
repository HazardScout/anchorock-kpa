"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const rivet_worker_1 = require("rivet/function/rivet-worker");
const rivet_user_worker_1 = require("rivet/function/rivet-user-worker");
const rivet_project_worker_1 = require("rivet/function/rivet-project-worker");
const globals_1 = require("@jest/globals");
require('dotenv').config();
(0, globals_1.describe)('running-test', () => {
    (0, globals_1.describe)('lambda', () => {
        const event = { headers: {} };
        const context = { functionVersion: '$LATEST' };
        const callback = {};
        (0, globals_1.it)('worker-handler', async () => {
            const event = {};
            const result = await (0, rivet_worker_1.rivetWorkerLambdaHandler)(event, context, callback);
            (0, globals_1.expect)(result.statusCode).toBe(200);
        }, 300000);
        (0, globals_1.it)('user-handler', async () => {
            let eventFile = (0, fs_1.readFileSync)('event-user.json', 'utf8');
            let event = JSON.parse(eventFile);
            const result = await (0, rivet_user_worker_1.rivetUserLambdaHandler)(event, context, callback);
            (0, globals_1.expect)(result.statusCode).toBe(200);
        }, 300000);
        (0, globals_1.it)('project-handler', async () => {
            let eventFile = (0, fs_1.readFileSync)('event-project.json', 'utf8');
            let event = JSON.parse(eventFile);
            const result = await (0, rivet_project_worker_1.rivetProjectLambdaHandler)(event, context, callback);
            (0, globals_1.expect)(result.statusCode).toBe(200);
        }, 300000);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3JpdmV0LWludGVncmF0aW9uL3Rlc3QvaW5kZXgudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJCQUFrQztBQUNsQyw4REFBdUU7QUFDdkUsd0VBQTBFO0FBQzFFLDhFQUFnRjtBQUNoRiwyQ0FJdUI7QUFFdkIsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRTNCLElBQUEsa0JBQVEsRUFBQyxjQUFjLEVBQUUsR0FBRyxFQUFFO0lBRTVCLElBQUEsa0JBQVEsRUFBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO1FBQ3RCLE1BQU0sS0FBSyxHQUFRLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBQyxDQUFDO1FBQ2xDLE1BQU0sT0FBTyxHQUFRLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxDQUFDO1FBQ3BELE1BQU0sUUFBUSxHQUFRLEVBQUUsQ0FBQztRQUV6QixJQUFBLFlBQUUsRUFBQyxnQkFBZ0IsRUFBRSxLQUFLLElBQUksRUFBRTtZQUM5QixNQUFNLEtBQUssR0FBRyxFQUFFLENBQUE7WUFDaEIsTUFBTSxNQUFNLEdBQVEsTUFBTSxJQUFBLHVDQUF3QixFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDN0UsSUFBQSxnQkFBTSxFQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBRVYsSUFBQSxZQUFFLEVBQUMsY0FBYyxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQzVCLElBQUksU0FBUyxHQUFHLElBQUEsaUJBQVksRUFBQyxpQkFBaUIsRUFBQyxNQUFNLENBQUMsQ0FBQTtZQUN0RCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBQ2pDLE1BQU0sTUFBTSxHQUFRLE1BQU0sSUFBQSwwQ0FBc0IsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzNFLElBQUEsZ0JBQU0sRUFBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUdWLElBQUEsWUFBRSxFQUFDLGlCQUFpQixFQUFFLEtBQUssSUFBSSxFQUFFO1lBQy9CLElBQUksU0FBUyxHQUFHLElBQUEsaUJBQVksRUFBQyxvQkFBb0IsRUFBQyxNQUFNLENBQUMsQ0FBQTtZQUN6RCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBQ2pDLE1BQU0sTUFBTSxHQUFRLE1BQU0sSUFBQSxnREFBeUIsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzlFLElBQUEsZ0JBQU0sRUFBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQTtJQUVaLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZWFkRmlsZVN5bmMgfSBmcm9tIFwiZnNcIjtcbmltcG9ydCB7IHJpdmV0V29ya2VyTGFtYmRhSGFuZGxlciB9IGZyb20gXCJyaXZldC9mdW5jdGlvbi9yaXZldC13b3JrZXJcIjtcbmltcG9ydCB7IHJpdmV0VXNlckxhbWJkYUhhbmRsZXIgfSBmcm9tIFwicml2ZXQvZnVuY3Rpb24vcml2ZXQtdXNlci13b3JrZXJcIjtcbmltcG9ydCB7IHJpdmV0UHJvamVjdExhbWJkYUhhbmRsZXIgfSBmcm9tIFwicml2ZXQvZnVuY3Rpb24vcml2ZXQtcHJvamVjdC13b3JrZXJcIjtcbmltcG9ydCB7XG4gIGRlc2NyaWJlLFxuICBpdCxcbiAgZXhwZWN0LFxufSBmcm9tICdAamVzdC9nbG9iYWxzJztcblxucmVxdWlyZSgnZG90ZW52JykuY29uZmlnKCk7XG5cbmRlc2NyaWJlKCdydW5uaW5nLXRlc3QnLCAoKSA9PiB7XG5cbiAgZGVzY3JpYmUoJ2xhbWJkYScsICgpID0+IHtcbiAgICBjb25zdCBldmVudDogYW55ID0geyBoZWFkZXJzOiB7fX07XG4gICAgY29uc3QgY29udGV4dDogYW55ID0geyBmdW5jdGlvblZlcnNpb246ICckTEFURVNUJyB9O1xuICAgIGNvbnN0IGNhbGxiYWNrOiBhbnkgPSB7fTtcblxuICAgIGl0KCd3b3JrZXItaGFuZGxlcicsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGV2ZW50ID0ge31cbiAgICAgIGNvbnN0IHJlc3VsdDogYW55ID0gYXdhaXQgcml2ZXRXb3JrZXJMYW1iZGFIYW5kbGVyKGV2ZW50LCBjb250ZXh0LCBjYWxsYmFjayk7XG4gICAgICBleHBlY3QocmVzdWx0LnN0YXR1c0NvZGUpLnRvQmUoMjAwKTtcbiAgICB9LCAzMDAwMDApXG5cbiAgICBpdCgndXNlci1oYW5kbGVyJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbGV0IGV2ZW50RmlsZSA9IHJlYWRGaWxlU3luYygnZXZlbnQtdXNlci5qc29uJywndXRmOCcpXG4gICAgICBsZXQgZXZlbnQgPSBKU09OLnBhcnNlKGV2ZW50RmlsZSlcbiAgICAgIGNvbnN0IHJlc3VsdDogYW55ID0gYXdhaXQgcml2ZXRVc2VyTGFtYmRhSGFuZGxlcihldmVudCwgY29udGV4dCwgY2FsbGJhY2spO1xuICAgICAgZXhwZWN0KHJlc3VsdC5zdGF0dXNDb2RlKS50b0JlKDIwMCk7XG4gICAgfSwgMzAwMDAwKVxuXG5cbiAgICBpdCgncHJvamVjdC1oYW5kbGVyJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbGV0IGV2ZW50RmlsZSA9IHJlYWRGaWxlU3luYygnZXZlbnQtcHJvamVjdC5qc29uJywndXRmOCcpXG4gICAgICBsZXQgZXZlbnQgPSBKU09OLnBhcnNlKGV2ZW50RmlsZSlcbiAgICAgIGNvbnN0IHJlc3VsdDogYW55ID0gYXdhaXQgcml2ZXRQcm9qZWN0TGFtYmRhSGFuZGxlcihldmVudCwgY29udGV4dCwgY2FsbGJhY2spO1xuICAgICAgZXhwZWN0KHJlc3VsdC5zdGF0dXNDb2RlKS50b0JlKDIwMCk7XG4gICAgfSwgMzAwMDAwKVxuXG4gIH0pXG59KVxuIl19