export class Helper {
  static csvContentChecker(data:string) : string {
    if (data == null) {
      return '';
    }

    let finalData = String(data).trim();

    // Must check for both text characters ('\\r\\n') and actual unicode ('\r\n')
    const regex = /\\r\\n|\r\n|\\r|\\n|\r|\n/g
    finalData = finalData.replace(regex, ' ')
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
