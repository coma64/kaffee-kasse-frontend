import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environments/environment';
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  tryedSubmitting = false;
  credentialsValid = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(environment.passwordMinimumLength),
        ],
      ],
    });
  }

  get username(): AbstractControl {
    return this.loginForm.get('username') as AbstractControl;
  }

  get password(): AbstractControl {
    return this.loginForm.get('password') as AbstractControl;
  }

  onSubmit(): void {
    this.tryedSubmitting = true;

    if (!this.loginForm.touched || !this.loginForm.valid) return;

    this.authService
      .login(this.username.value, this.password.value)
      .subscribe((credentialsValid) => {
        this.credentialsValid = credentialsValid;
        if (!credentialsValid) return;

        this.router.navigate([
          this.route.snapshot.queryParams['returnUrl'] || '/',
        ]);
      });
  }
}
