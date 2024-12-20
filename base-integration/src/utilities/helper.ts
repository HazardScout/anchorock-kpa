export class Helper {
  static csvContentChecker(data: string): string {
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

  static formatDatesIfEpoch(incomingDate: string | number): string {
    if (!incomingDate) {
      return '';
    }
    // if epoch time
    if (
      typeof incomingDate === 'number' &&
      incomingDate.toString().length >= 10
    ) {
      const date = new Date(incomingDate);
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }
    // Return the original value if not epoch time
    return incomingDate as string;
  }
}
