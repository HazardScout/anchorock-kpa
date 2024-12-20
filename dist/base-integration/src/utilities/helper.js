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
        if (finalData.indexOf(',') < 0 && finalData.indexOf('"') < 0) {
            return finalData;
        }
        finalData = finalData.replace(/"/g, '""');
        return `"${finalData}"`;
    }
    static formatDatesIfEpoch(incomingDate) {
        if (!incomingDate) {
            return '';
        }
        // if epoch time
        if (typeof incomingDate === 'number' &&
            incomingDate.toString().length >= 10) {
            // return in format mm/dd/yyyy
            return new Date(incomingDate).toLocaleDateString('en-US');
        }
        // Return the original value if not epoch time
        return incomingDate;
    }
}
exports.Helper = Helper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvdXRpbGl0aWVzL2hlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxNQUFhLE1BQU07SUFDakIsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQVk7UUFDbkMsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFLENBQUM7WUFDakIsT0FBTyxFQUFFLENBQUM7UUFDWixDQUFDO1FBRUQsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRXBDLDZFQUE2RTtRQUM3RSxNQUFNLEtBQUssR0FBRyw0QkFBNEIsQ0FBQztRQUMzQyxTQUFTLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDMUMsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQzdELE9BQU8sU0FBUyxDQUFDO1FBQ25CLENBQUM7UUFFRCxTQUFTLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDMUMsT0FBTyxJQUFJLFNBQVMsR0FBRyxDQUFDO0lBQzFCLENBQUM7SUFFRCxNQUFNLENBQUMsa0JBQWtCLENBQUMsWUFBNkI7UUFDckQsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ2xCLE9BQU8sRUFBRSxDQUFDO1FBQ1osQ0FBQztRQUNELGdCQUFnQjtRQUNoQixJQUNFLE9BQU8sWUFBWSxLQUFLLFFBQVE7WUFDaEMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sSUFBSSxFQUFFLEVBQ3BDLENBQUM7WUFDRCw4QkFBOEI7WUFDOUIsT0FBTyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM1RCxDQUFDO1FBQ0QsOENBQThDO1FBQzlDLE9BQU8sWUFBc0IsQ0FBQztJQUNoQyxDQUFDO0NBQ0Y7QUFsQ0Qsd0JBa0NDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIEhlbHBlciB7XG4gIHN0YXRpYyBjc3ZDb250ZW50Q2hlY2tlcihkYXRhOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmIChkYXRhID09IG51bGwpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBsZXQgZmluYWxEYXRhID0gU3RyaW5nKGRhdGEpLnRyaW0oKTtcblxuICAgIC8vIE11c3QgY2hlY2sgZm9yIGJvdGggdGV4dCBjaGFyYWN0ZXJzICgnXFxcXHJcXFxcbicpIGFuZCBhY3R1YWwgdW5pY29kZSAoJ1xcclxcbicpXG4gICAgY29uc3QgcmVnZXggPSAvXFxcXHJcXFxcbnxcXHJcXG58XFxcXHJ8XFxcXG58XFxyfFxcbi9nO1xuICAgIGZpbmFsRGF0YSA9IGZpbmFsRGF0YS5yZXBsYWNlKHJlZ2V4LCAnICcpO1xuICAgIGlmIChmaW5hbERhdGEuaW5kZXhPZignLCcpIDwgMCAmJiBmaW5hbERhdGEuaW5kZXhPZignXCInKSA8IDApIHtcbiAgICAgIHJldHVybiBmaW5hbERhdGE7XG4gICAgfVxuXG4gICAgZmluYWxEYXRhID0gZmluYWxEYXRhLnJlcGxhY2UoL1wiL2csICdcIlwiJyk7XG4gICAgcmV0dXJuIGBcIiR7ZmluYWxEYXRhfVwiYDtcbiAgfVxuXG4gIHN0YXRpYyBmb3JtYXREYXRlc0lmRXBvY2goaW5jb21pbmdEYXRlOiBzdHJpbmcgfCBudW1iZXIpOiBzdHJpbmcge1xuICAgIGlmICghaW5jb21pbmdEYXRlKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIC8vIGlmIGVwb2NoIHRpbWVcbiAgICBpZiAoXG4gICAgICB0eXBlb2YgaW5jb21pbmdEYXRlID09PSAnbnVtYmVyJyAmJlxuICAgICAgaW5jb21pbmdEYXRlLnRvU3RyaW5nKCkubGVuZ3RoID49IDEwXG4gICAgKSB7XG4gICAgICAvLyByZXR1cm4gaW4gZm9ybWF0IG1tL2RkL3l5eXlcbiAgICAgIHJldHVybiBuZXcgRGF0ZShpbmNvbWluZ0RhdGUpLnRvTG9jYWxlRGF0ZVN0cmluZygnZW4tVVMnKTtcbiAgICB9XG4gICAgLy8gUmV0dXJuIHRoZSBvcmlnaW5hbCB2YWx1ZSBpZiBub3QgZXBvY2ggdGltZVxuICAgIHJldHVybiBpbmNvbWluZ0RhdGUgYXMgc3RyaW5nO1xuICB9XG59XG4iXX0=