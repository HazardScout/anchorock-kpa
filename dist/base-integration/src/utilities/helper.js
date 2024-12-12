"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helper = void 0;
class Helper {
    static csvContentChecker(data) {
        if (data == null) {
            return '';
        }
        let finalData = String(data).trim();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvdXRpbGl0aWVzL2hlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxNQUFhLE1BQU07SUFDakIsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQVc7UUFDbEMsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFLENBQUM7WUFDakIsT0FBTyxFQUFFLENBQUM7UUFDWixDQUFDO1FBRUQsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRXBDLDZFQUE2RTtRQUM3RSxNQUFNLEtBQUssR0FBRyw0QkFBNEIsQ0FBQTtRQUMxQyxTQUFTLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFDekMsSUFDRSxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7ZUFDdkIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQzdCLENBQUM7WUFDRCxPQUFPLFNBQVMsQ0FBQztRQUNuQixDQUFDO1FBRUQsU0FBUyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzFDLE9BQU8sSUFBSSxTQUFTLEdBQUcsQ0FBQztJQUMxQixDQUFDO0NBQ0Y7QUFyQkQsd0JBcUJDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIEhlbHBlciB7XG4gIHN0YXRpYyBjc3ZDb250ZW50Q2hlY2tlcihkYXRhOnN0cmluZykgOiBzdHJpbmcge1xuICAgIGlmIChkYXRhID09IG51bGwpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBsZXQgZmluYWxEYXRhID0gU3RyaW5nKGRhdGEpLnRyaW0oKTtcblxuICAgIC8vIE11c3QgY2hlY2sgZm9yIGJvdGggdGV4dCBjaGFyYWN0ZXJzICgnXFxcXHJcXFxcbicpIGFuZCBhY3R1YWwgdW5pY29kZSAoJ1xcclxcbicpXG4gICAgY29uc3QgcmVnZXggPSAvXFxcXHJcXFxcbnxcXHJcXG58XFxcXHJ8XFxcXG58XFxyfFxcbi9nXG4gICAgZmluYWxEYXRhID0gZmluYWxEYXRhLnJlcGxhY2UocmVnZXgsICcgJylcbiAgICBpZiAoXG4gICAgICBmaW5hbERhdGEuaW5kZXhPZignLCcpIDwgMFxuICAgICAgJiYgZmluYWxEYXRhLmluZGV4T2YoJ1wiJykgPCAwXG4gICAgKSB7XG4gICAgICByZXR1cm4gZmluYWxEYXRhO1xuICAgIH1cblxuICAgIGZpbmFsRGF0YSA9IGZpbmFsRGF0YS5yZXBsYWNlKC9cIi9nLCAnXCJcIicpO1xuICAgIHJldHVybiBgXCIke2ZpbmFsRGF0YX1cImA7XG4gIH1cbn1cbiJdfQ==