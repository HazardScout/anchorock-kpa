export class Helper {
  static csvContentChecker(data:string) : string {
    if (data == null) {
      return '';
    }

    let finalData = data.trim();

    finalData = finalData.replace('\r\n', ' ')
    finalData = finalData.replace('\r', ' ')
    finalData = finalData.replace('\n', ' ')

    if (
      finalData.indexOf(',') < 0
      && finalData.indexOf('"') < 0
    ) {
      return finalData;
    }

    finalData = finalData.replace(/"/g, '""');
    return `"${finalData}"`;
  }
}
