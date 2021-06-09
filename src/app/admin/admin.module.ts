import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { BeverageTypeListComponent } from './components/beverage-type-list/beverage-type-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BalanceHighlightDirective } from './directives/balance-highlight/balance-highlight.directive';

@NgModule({
  declarations: [
    BeverageTypeListComponent, 
    BalanceHighlightDirective,
  ],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, AdminRoutingModule],
})
export class AdminModule {}
