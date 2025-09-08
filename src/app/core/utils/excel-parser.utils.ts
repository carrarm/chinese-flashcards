import readXlsxFile, { readSheetNames } from "read-excel-file";

export interface VocabSheetTuple {
  characters: string;
  pinyin: string;
  meanings: string;
}

export class VocabularySheetParser {
  // Tuples start at columns A and E
  private static readonly TUPLE_COL_START = [0, 4];

  public static async parse(file: File): Promise<{
    sheets: Record<string, VocabSheetTuple[]>;
    parsingErrors: string[];
  }> {
    const parsingErrors: string[] = [];
    const parsedSheets: Record<string, VocabSheetTuple[]> = {};

    const sheets = await readSheetNames(file);

    const promises = sheets.map(async (sheetName) => {
      const tuples: VocabSheetTuple[] = [];
      const rows = await readXlsxFile(file, { sheet: sheetName });
      rows.forEach((row, rowIndex) => {
        VocabularySheetParser.TUPLE_COL_START.forEach((colStart) => {
          if (row.at(colStart)) {
            try {
              tuples.push(VocabularySheetParser.readTuple(rowIndex, row, colStart));
            } catch (error) {
              parsingErrors.push(error as string);
            }
          }
        });
      });
      parsedSheets[sheetName] = tuples;
    });

    await Promise.all(promises);

    return { parsingErrors, sheets: parsedSheets };
  }

  private static readTuple(
    rowIndex: number,
    row: unknown[],
    colStart: number
  ): VocabSheetTuple {
    if (row.length < colStart + 3) {
      throw `[Row ${rowIndex + 1}] Parsing error - Tuple is missing columns (starting at ${colStart + 1})`;
    }
    const [characters, pinyin, meanings] = row.slice(colStart, colStart + 3) as string[];

    if (!meanings) {
      throw `[Row ${rowIndex + 1}] Parsing error - Meanings column cannot be empty (starting at ${colStart + 1})`;
    }

    return { characters, pinyin, meanings: `${meanings}` };
  }
}
