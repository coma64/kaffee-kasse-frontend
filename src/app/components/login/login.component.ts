import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public credentialsValid = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  login(username: string, password: string): void {
    this.authService.login(username, password).subscribe((credentialsValid) => {
      this.credentialsValid = credentialsValid;
      if (!credentialsValid) return;

      this.router.navigate([
        this.route.snapshot.queryParams['returnUrl'] || '/',
      ]);
    });
  }
}
