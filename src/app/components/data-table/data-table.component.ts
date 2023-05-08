import { Component, Input } from "@angular/core";
import { TableColumn, TableRow } from "./data-table.types";

@Component({
  selector: "chf-data-table",
  templateUrl: "./data-table.component.html",
  styleUrls: ["./data-table.component.scss"],
})
export class DataTableComponent<T> {
  @Input() columns: TableColumn<T>[] = [];
  @Input() rows: TableRow<T>[] = [];
}
