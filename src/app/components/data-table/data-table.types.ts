import { Indexable } from "@core/types";

export interface TableColumn<T> {
  label: string;
  fieldName: string;
  cssClass?: string;
  displayFunction?: (element: TableRow<T>) => string;
}

export type TableRow<T> = Indexable<unknown> & { data: T };
