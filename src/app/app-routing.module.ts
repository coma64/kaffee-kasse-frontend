import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '@components/dashboard/dashboard.component';
import { LoginComponent } from '@components/login/login.component';
import { RegisterComponent } from '@components/register/register.component';
import { SettingsComponent } from '@components/settings/settings.component';
import { UserDetailComponent } from '@components/user-detail/user-detail.component';
import { UserPurchaseHistoryComponent } from '@components/user-purchase-history/user-purchase-history.component';
import { UsersComponent } from '@components/users/users.component';
import { AuthGuard } from '@guards/auth/auth.guard';
import {BeverageComparisonComponent} from "@components/beverage-comparison/beverage-comparison.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user/:id',
    component: UserDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'top-users',
        component: UserPurchaseHistoryComponent,
      },
      {
        path: 'beverage-comparison',
        component: BeverageComparisonComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'top-users',
      },
    ],
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
