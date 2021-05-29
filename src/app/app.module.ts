import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from '@components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenAuthInterceptor } from '@interceptors/token-auth/token-auth.interceptor';
import { DashboardComponent } from '@components/dashboard/dashboard.component';
import { NavbarComponent } from '@components/navbar/navbar.component';
import { RegisterComponent } from './components/register/register.component';
import { SettingsComponent } from './components/settings/settings.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { UsersComponent } from './components/users/users.component';
import { DayjsFormatPipe } from './pipes/dayjsFormat/dayjs-format.pipe';
import { BalanceHighlightDirective } from './directives/balance-highlight/balance-highlight.directive';
import { CollapseableNavlinkDirective } from './directives/collapseable-navlink/collapseable-navlink.directive';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    DashboardComponent,
    RegisterComponent,
    SettingsComponent,
    UserDetailComponent,
    UsersComponent,
    DayjsFormatPipe,
    BalanceHighlightDirective,
    CollapseableNavlinkDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenAuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
