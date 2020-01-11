import Spreadsheet = GoogleAppsScript.Spreadsheet.Spreadsheet;
import { getDayFormat } from './util';

export class SheetService {
  static createInitialFile(prefix: string): Spreadsheet {
    const fileName = `${prefix} ${getDayFormat()}`;
    const ss = SpreadsheetApp.create(fileName);
    const range = ss.getRange('A1');
    range.setValue('Hello, clasp!');
    return ss;
  }

  static insertValues(values: any[]): void {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getActiveSheet();
    const range = sheet.getRange(sheet.getLastRow() + 1, 1, 1, sheet.getLastColumn());
    range.setValues([values]);
  }

  static isExsistsByDate(date: string): boolean {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getActiveSheet();
    const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
    const extracted = values.filter(array => {
      return getDayFormat(array[0]) === date;
    });
    if (extracted.length === 0) return false;
    else return true;
  }

  static sortDataByDate(): void {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getActiveSheet();
    sheet
      .getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn())
      .sort({ column: 1, ascending: false });
  }
}
