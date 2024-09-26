"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helper = void 0;
class Helper {
    static csvContentChecker(data) {
        if (data == null) {
            return '';
        }
        let finalData = data.trim();
        // Must check for both text characters ('\\r\\n') and actual unicode ('\r\n')
        const regex = /\\r\\n|\r\n|\\r|\\n|\r|\n/g;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvdXRpbGl0aWVzL2hlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxNQUFhLE1BQU07SUFDakIsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQVc7UUFDbEMsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFLENBQUM7WUFDakIsT0FBTyxFQUFFLENBQUM7UUFDWixDQUFDO1FBRUQsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBRTVCLDZFQUE2RTtRQUM3RSxNQUFNLEtBQUssR0FBRyw0QkFBNEIsQ0FBQTtRQUMxQyxTQUFTLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFDekMsSUFDRSxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7ZUFDdkIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQzdCLENBQUM7WUFDRCxPQUFPLFNBQVMsQ0FBQztRQUNuQixDQUFDO1FBRUQsU0FBUyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzFDLE9BQU8sSUFBSSxTQUFTLEdBQUcsQ0FBQztJQUMxQixDQUFDO0NBQ0Y7QUFyQkQsd0JBcUJDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIEhlbHBlciB7XG4gIHN0YXRpYyBjc3ZDb250ZW50Q2hlY2tlcihkYXRhOnN0cmluZykgOiBzdHJpbmcge1xuICAgIGlmIChkYXRhID09IG51bGwpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBsZXQgZmluYWxEYXRhID0gZGF0YS50cmltKCk7XG5cbiAgICAvLyBNdXN0IGNoZWNrIGZvciBib3RoIHRleHQgY2hhcmFjdGVycyAoJ1xcXFxyXFxcXG4nKSBhbmQgYWN0dWFsIHVuaWNvZGUgKCdcXHJcXG4nKVxuICAgIGNvbnN0IHJlZ2V4ID0gL1xcXFxyXFxcXG58XFxyXFxufFxcXFxyfFxcXFxufFxccnxcXG4vZ1xuICAgIGZpbmFsRGF0YSA9IGZpbmFsRGF0YS5yZXBsYWNlKHJlZ2V4LCAnICcpXG4gICAgaWYgKFxuICAgICAgZmluYWxEYXRhLmluZGV4T2YoJywnKSA8IDBcbiAgICAgICYmIGZpbmFsRGF0YS5pbmRleE9mKCdcIicpIDwgMFxuICAgICkge1xuICAgICAgcmV0dXJuIGZpbmFsRGF0YTtcbiAgICB9XG5cbiAgICBmaW5hbERhdGEgPSBmaW5hbERhdGEucmVwbGFjZSgvXCIvZywgJ1wiXCInKTtcbiAgICByZXR1cm4gYFwiJHtmaW5hbERhdGF9XCJgO1xuICB9XG59XG4iXX0=