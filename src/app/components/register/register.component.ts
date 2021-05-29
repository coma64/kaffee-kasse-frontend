import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environments/environment';
import { User } from '@models/user';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  tryedSubmitting = false;
  usernameUnavailable = false;
  lastUsername?: string;

  passwordMinimumLength = environment.passwordMinimumLength;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
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

  onSubmit(): void {
    this.tryedSubmitting = true;

    if (!this.registerForm.touched || !this.registerForm.valid) return;

    const user = {
      username: this.username.value,
      password: this.password.value,
    } as User;

    this.lastUsername = user.username;

    this.userService.createUser(user).subscribe(
      () =>
        this.router.navigate([
          this.route.snapshot.queryParams['returnUrl'] || '/login',
        ]),
      (error: HttpErrorResponse) => {
        if ('username' in error.error) this.usernameUnavailable = true;
        else throw error;
      }
    );
  }

  get username(): AbstractControl {
    return this.registerForm.get('username') as AbstractControl;
  }

  get password(): AbstractControl {
    return this.registerForm.get('password') as AbstractControl;
  }
}
