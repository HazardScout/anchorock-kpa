"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helper = void 0;
class Helper {
    static csvContentChecker(data) {
        if (data == null) {
            return '';
        }
        let finalData = data.trim();
        if (finalData.indexOf(',') < 0
            && finalData.indexOf('"') < 0) {
            return finalData;
        }
        finalData = finalData.replace(/"/g, '""');
        return `"${finalData}"`;
    }
}
exports.Helper = Helper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vYmFzZS1pbnRlZ3JhdGlvbi9zcmMvdXRpbGl0aWVzL2hlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxNQUFhLE1BQU07SUFDakIsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQVc7UUFDbEMsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFLENBQUM7WUFDakIsT0FBTyxFQUFFLENBQUM7UUFDWixDQUFDO1FBRUQsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBRTVCLElBQ0UsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO2VBQ3ZCLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUM3QixDQUFDO1lBQ0QsT0FBTyxTQUFTLENBQUM7UUFDbkIsQ0FBQztRQUVELFNBQVMsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMxQyxPQUFPLElBQUksU0FBUyxHQUFHLENBQUM7SUFDMUIsQ0FBQztDQUNGO0FBbEJELHdCQWtCQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBIZWxwZXIge1xuICBzdGF0aWMgY3N2Q29udGVudENoZWNrZXIoZGF0YTpzdHJpbmcpIDogc3RyaW5nIHtcbiAgICBpZiAoZGF0YSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgbGV0IGZpbmFsRGF0YSA9IGRhdGEudHJpbSgpO1xuXG4gICAgaWYgKFxuICAgICAgZmluYWxEYXRhLmluZGV4T2YoJywnKSA8IDBcbiAgICAgICYmIGZpbmFsRGF0YS5pbmRleE9mKCdcIicpIDwgMFxuICAgICkge1xuICAgICAgcmV0dXJuIGZpbmFsRGF0YTtcbiAgICB9XG5cbiAgICBmaW5hbERhdGEgPSBmaW5hbERhdGEucmVwbGFjZSgvXCIvZywgJ1wiXCInKTtcbiAgICByZXR1cm4gYFwiJHtmaW5hbERhdGF9XCJgO1xuICB9XG59XG4iXX0=