import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';
import { Collapse } from 'bootstrap';
import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import * as localizedFormat from 'dayjs/plugin/localizedFormat';
import * as locale_de from 'dayjs/locale/de';

@Component({
  selector: 'app-root',
  template: `
    <app-navbar></app-navbar>
    <main style="height: calc(100vh - 4.1rem)">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class AppComponent implements OnInit {
  title = 'kaffee-kasse-frontend';
  @ViewChild('navbarToggler') navbarTogglerElement?: HTMLElement;

  constructor(public authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    if (this.navbarTogglerElement) new Collapse(this.navbarTogglerElement);

    dayjs.extend(relativeTime);
    dayjs.extend(localizedFormat);

    dayjs.locale(locale_de);
  }
}
