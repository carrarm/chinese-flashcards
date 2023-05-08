import { Pipe, PipeTransform } from "@angular/core";
import { TableColumn, TableRow } from "./data-table.types";

@Pipe({
  name: "dataCellContent",
})
export class DataCellContentPipe<T> implements PipeTransform {
  transform(cell: TableRow<T>, column: TableColumn<T>): string {
    const cellValue = cell[column.fieldName];
    if (cellValue === null || cellValue === undefined) {
      return "";
    }
    return column.displayFunction ? column.displayFunction(cell) : `${cellValue}`;
  }
}
