import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '@environments/environment';
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

  constructor(public authService: AuthService, private http: HttpClient) {}

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

  logMe() {
    this.http.get(`${environment.apiUrl}/users/me/`).subscribe(
      user => console.log(user)
    )
  }
}
