import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';
import { Collapse } from 'bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'kaffee-kasse-frontend';
  @ViewChild('navbarToggler') navbarTogglerElement?: HTMLElement;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    if (this.navbarTogglerElement)
      new Collapse(this.navbarTogglerElement);
    this.authService.credentials$.subscribe(creds => console.log(creds, 'creds sub'));
  }

  login(username: string, password: string) {
    this.authService.login(username, password).subscribe(
      loggedIn => console.log(loggedIn)
    );
  }

  logUser() {
    console.log(this.authService.credentials);
  }

  logout() {
    this.authService.logout();
  }
}
