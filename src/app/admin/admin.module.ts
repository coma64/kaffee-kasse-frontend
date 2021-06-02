import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { BeverageTypeListComponent } from './components/beverage-type-list/beverage-type-list.component';


@NgModule({
  declarations: [
    BeverageTypeListComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
