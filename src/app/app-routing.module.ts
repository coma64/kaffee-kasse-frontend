import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '@components/login/login.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: AppComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
