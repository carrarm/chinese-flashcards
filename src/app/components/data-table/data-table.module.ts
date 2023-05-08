import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DataTableComponent } from "./data-table.component";
import { PaginatorComponent } from "./paginator/paginator.component";
import { DataCellContentPipe } from './data-cell-content.pipe';

@NgModule({
  declarations: [DataTableComponent, PaginatorComponent, DataCellContentPipe],
  imports: [CommonModule],
  exports: [DataTableComponent],
})
export class DataTableModule {}
