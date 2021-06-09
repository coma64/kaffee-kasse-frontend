import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth/auth.guard';
import { IsStaffGuard } from '@guards/is-staff/is-staff.guard';
import { AdminUserDetailComponent } from './components/admin-user-detail/admin-user-detail.component';
import { BeverageTypeListComponent } from './components/beverage-type-list/beverage-type-list.component';

const routes: Routes = [
  {
    path: 'admin',
    canActivate: [AuthGuard, IsStaffGuard],
    children: [
      { path: 'beverage-types', component: BeverageTypeListComponent },
      { path: 'user/:id', component: AdminUserDetailComponent },
      { path: '', redirectTo: 'beverage-types', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
