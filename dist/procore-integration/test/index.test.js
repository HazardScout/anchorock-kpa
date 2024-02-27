"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const procore_execution_worker_1 = require("procore/function/procore-execution-worker");
const procore_extraction_worker_1 = require("procore/function/procore-extraction-worker");
const globals_1 = require("@jest/globals");
require('dotenv').config();
(0, globals_1.describe)('running-test', () => {
    (0, globals_1.describe)('lambda', () => {
        const event = { headers: {} };
        const context = { functionVersion: '$LATEST' };
        const callback = {};
        (0, globals_1.it)('extraction-handler', async () => {
            const event = {};
            const result = await (0, procore_extraction_worker_1.extractionLambdaHandler)(event, context, callback);
            (0, globals_1.expect)(result.statusCode).toBe(200);
        }, 300000);
        (0, globals_1.it)('execution-handler', async () => {
            let eventFile = (0, fs_1.readFileSync)('event-execution.json', 'utf8');
            let event = JSON.parse(eventFile);
            const result = await (0, procore_execution_worker_1.executionLambdaHandler)(event, context, callback);
            (0, globals_1.expect)(result.statusCode).toBe(200);
        }, 300000);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Byb2NvcmUtaW50ZWdyYXRpb24vdGVzdC9pbmRleC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkJBQWtDO0FBQ2xDLHdGQUFtRjtBQUNuRiwwRkFBcUY7QUFDckYsMkNBSXVCO0FBRXZCLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUUzQixJQUFBLGtCQUFRLEVBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtJQUU1QixJQUFBLGtCQUFRLEVBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtRQUN0QixNQUFNLEtBQUssR0FBUSxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUMsQ0FBQztRQUNsQyxNQUFNLE9BQU8sR0FBUSxFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQUUsQ0FBQztRQUNwRCxNQUFNLFFBQVEsR0FBUSxFQUFFLENBQUM7UUFFekIsSUFBQSxZQUFFLEVBQUMsb0JBQW9CLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDbEMsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFBO1lBQ2hCLE1BQU0sTUFBTSxHQUFRLE1BQU0sSUFBQSxtREFBdUIsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzVFLElBQUEsZ0JBQU0sRUFBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUVWLElBQUEsWUFBRSxFQUFDLG1CQUFtQixFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ2pDLElBQUksU0FBUyxHQUFHLElBQUEsaUJBQVksRUFBQyxzQkFBc0IsRUFBQyxNQUFNLENBQUMsQ0FBQTtZQUMzRCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBQ2pDLE1BQU0sTUFBTSxHQUFRLE1BQU0sSUFBQSxpREFBc0IsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzNFLElBQUEsZ0JBQU0sRUFBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQTtJQUVaLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZWFkRmlsZVN5bmMgfSBmcm9tIFwiZnNcIjtcbmltcG9ydCB7IGV4ZWN1dGlvbkxhbWJkYUhhbmRsZXIgfSBmcm9tIFwicHJvY29yZS9mdW5jdGlvbi9wcm9jb3JlLWV4ZWN1dGlvbi13b3JrZXJcIjtcbmltcG9ydCB7IGV4dHJhY3Rpb25MYW1iZGFIYW5kbGVyIH0gZnJvbSBcInByb2NvcmUvZnVuY3Rpb24vcHJvY29yZS1leHRyYWN0aW9uLXdvcmtlclwiO1xuaW1wb3J0IHtcbiAgZGVzY3JpYmUsXG4gIGl0LFxuICBleHBlY3QsXG59IGZyb20gJ0BqZXN0L2dsb2JhbHMnO1xuXG5yZXF1aXJlKCdkb3RlbnYnKS5jb25maWcoKTtcblxuZGVzY3JpYmUoJ3J1bm5pbmctdGVzdCcsICgpID0+IHtcblxuICBkZXNjcmliZSgnbGFtYmRhJywgKCkgPT4ge1xuICAgIGNvbnN0IGV2ZW50OiBhbnkgPSB7IGhlYWRlcnM6IHt9fTtcbiAgICBjb25zdCBjb250ZXh0OiBhbnkgPSB7IGZ1bmN0aW9uVmVyc2lvbjogJyRMQVRFU1QnIH07XG4gICAgY29uc3QgY2FsbGJhY2s6IGFueSA9IHt9O1xuXG4gICAgaXQoJ2V4dHJhY3Rpb24taGFuZGxlcicsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGV2ZW50ID0ge31cbiAgICAgIGNvbnN0IHJlc3VsdDogYW55ID0gYXdhaXQgZXh0cmFjdGlvbkxhbWJkYUhhbmRsZXIoZXZlbnQsIGNvbnRleHQsIGNhbGxiYWNrKTtcbiAgICAgIGV4cGVjdChyZXN1bHQuc3RhdHVzQ29kZSkudG9CZSgyMDApO1xuICAgIH0sIDMwMDAwMClcblxuICAgIGl0KCdleGVjdXRpb24taGFuZGxlcicsIGFzeW5jICgpID0+IHtcbiAgICAgIGxldCBldmVudEZpbGUgPSByZWFkRmlsZVN5bmMoJ2V2ZW50LWV4ZWN1dGlvbi5qc29uJywndXRmOCcpXG4gICAgICBsZXQgZXZlbnQgPSBKU09OLnBhcnNlKGV2ZW50RmlsZSlcbiAgICAgIGNvbnN0IHJlc3VsdDogYW55ID0gYXdhaXQgZXhlY3V0aW9uTGFtYmRhSGFuZGxlcihldmVudCwgY29udGV4dCwgY2FsbGJhY2spO1xuICAgICAgZXhwZWN0KHJlc3VsdC5zdGF0dXNDb2RlKS50b0JlKDIwMCk7XG4gICAgfSwgMzAwMDAwKVxuXG4gIH0pXG59KVxuIl19