export class Helper {
  static csvContentChecker(data:string) : string {
    if (data == null) {
      return '';
    }

    let finalData = data.trim();

    const regex = /\/r|\/n/g
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
