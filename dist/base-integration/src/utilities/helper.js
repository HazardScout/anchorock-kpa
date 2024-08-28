"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helper = void 0;
class Helper {
    static csvContentChecker(data) {
        if (data == null) {
            return '';
        }
        let finalData = data.trim();
        const regex = /\/r|\/n/g;
        finalData = finalData.replace(regex, ' ');
        if (finalData.indexOf(',') < 0
            && finalData.indexOf('"') < 0) {
            return finalData;
        }
        finalData = finalData.replace(/"/g, '""');
        return `"${finalData}"`;
    }
}
exports.Helper = Helper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvdXRpbGl0aWVzL2hlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxNQUFhLE1BQU07SUFDakIsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQVc7UUFDbEMsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFLENBQUM7WUFDakIsT0FBTyxFQUFFLENBQUM7UUFDWixDQUFDO1FBRUQsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBRTVCLE1BQU0sS0FBSyxHQUFHLFVBQVUsQ0FBQTtRQUN4QixTQUFTLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFDekMsSUFDRSxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7ZUFDdkIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQzdCLENBQUM7WUFDRCxPQUFPLFNBQVMsQ0FBQztRQUNuQixDQUFDO1FBRUQsU0FBUyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzFDLE9BQU8sSUFBSSxTQUFTLEdBQUcsQ0FBQztJQUMxQixDQUFDO0NBQ0Y7QUFwQkQsd0JBb0JDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIEhlbHBlciB7XG4gIHN0YXRpYyBjc3ZDb250ZW50Q2hlY2tlcihkYXRhOnN0cmluZykgOiBzdHJpbmcge1xuICAgIGlmIChkYXRhID09IG51bGwpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBsZXQgZmluYWxEYXRhID0gZGF0YS50cmltKCk7XG5cbiAgICBjb25zdCByZWdleCA9IC9cXC9yfFxcL24vZ1xuICAgIGZpbmFsRGF0YSA9IGZpbmFsRGF0YS5yZXBsYWNlKHJlZ2V4LCAnICcpXG4gICAgaWYgKFxuICAgICAgZmluYWxEYXRhLmluZGV4T2YoJywnKSA8IDBcbiAgICAgICYmIGZpbmFsRGF0YS5pbmRleE9mKCdcIicpIDwgMFxuICAgICkge1xuICAgICAgcmV0dXJuIGZpbmFsRGF0YTtcbiAgICB9XG5cbiAgICBmaW5hbERhdGEgPSBmaW5hbERhdGEucmVwbGFjZSgvXCIvZywgJ1wiXCInKTtcbiAgICByZXR1cm4gYFwiJHtmaW5hbERhdGF9XCJgO1xuICB9XG59XG4iXX0=