export class Helper {
    static csvContentChecker(data:string) : string {
        if (data == null) {
            return '';
        }

        var finalData = data.trim()

        if (finalData.indexOf(',') != -1) {
            return `"${finalData}"`;
        }

        return finalData
    }
}