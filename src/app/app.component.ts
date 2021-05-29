import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';
import { Collapse } from 'bootstrap';
import dayjs from 'dayjs/esm';
import relativeTime from 'dayjs/esm/plugin/relativeTime';
import localizedFormat from 'dayjs/esm/plugin/localizedFormat';
import locale_de from 'dayjs/esm/locale/de';

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
