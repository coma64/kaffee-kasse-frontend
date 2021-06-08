import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { BeverageTypeListComponent } from './components/beverage-type-list/beverage-type-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [BeverageTypeListComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, AdminRoutingModule],
})
export class AdminModule {}
