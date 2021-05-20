import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TableComponent } from './table.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [TableComponent],
  exports: [TableComponent]
})
export class TableModule {}
