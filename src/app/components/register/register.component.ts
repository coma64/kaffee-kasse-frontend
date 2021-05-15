import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@models/user';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  usernameErrors: string[] = [];
  passwordErrors: string[] = [];

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  register(registerForm: NgForm): void {
    console.log(registerForm);

    this.usernameErrors = [];
    this.passwordErrors = [];

    if (registerForm.controls['username'].invalid)
      this.usernameErrors.push('Bitte gib einen Benutzernamen ein');
    if (registerForm.controls['password'].invalid)
      this.passwordErrors.push('Password mindest länge: 8 Zeichen');

    if (this.usernameErrors.length !== 0 || this.passwordErrors.length !== 0)
      return;

    this.userService.createUser(registerForm.value as User).subscribe(
      () =>
        this.router.navigate([
          this.route.snapshot.queryParams['returnUrl'] || '/login',
        ]),
      (error: HttpErrorResponse) => {
        if ('username' in error.error)
          this.usernameErrors.push('Dieser Benutzername ist bereits vergeben');
        else throw error;
      }
    );
  }
}
