"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helper = void 0;
class Helper {
    static csvContentChecker(data) {
        if (data == null) {
            return '';
        }
        var finalData = data.trim();
        if (finalData.indexOf(',') != -1) {
            return `"${finalData}"`;
        }
        return finalData;
    }
}
exports.Helper = Helper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvdXRpbGl0aWVzL2hlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxNQUFhLE1BQU07SUFDZixNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBVztRQUNoQyxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUNmLE9BQU8sRUFBRSxDQUFDO1FBQ2QsQ0FBQztRQUVELElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUUzQixJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUMvQixPQUFPLElBQUksU0FBUyxHQUFHLENBQUM7UUFDNUIsQ0FBQztRQUVELE9BQU8sU0FBUyxDQUFBO0lBQ3BCLENBQUM7Q0FDSjtBQWRELHdCQWNDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIEhlbHBlciB7XG4gICAgc3RhdGljIGNzdkNvbnRlbnRDaGVja2VyKGRhdGE6c3RyaW5nKSA6IHN0cmluZyB7XG4gICAgICAgIGlmIChkYXRhID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmaW5hbERhdGEgPSBkYXRhLnRyaW0oKVxuXG4gICAgICAgIGlmIChmaW5hbERhdGEuaW5kZXhPZignLCcpICE9IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gYFwiJHtmaW5hbERhdGF9XCJgO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbmFsRGF0YVxuICAgIH1cbn0iXX0=