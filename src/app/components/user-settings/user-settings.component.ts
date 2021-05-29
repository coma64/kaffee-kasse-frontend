import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { User } from '@models/user';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
})
export class UserSettingsComponent implements OnInit {
  @Input() user?: User;
  settingsForm?: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.settingsForm = this.formBuilder.group(
      {
        password: ['', [Validators.minLength(4)]],
        passwordConfirm: ['', [Validators.minLength(4)]],
      },
      {
        validators: [this.passwordsMatch],
      }
    );
  }

  private passwordsMatch(formGroup: AbstractControl): ValidationErrors | null {
    if (!(formGroup instanceof FormGroup)) return null;

    const { password, passwordConfirm } = formGroup.controls;

    if (!password.dirty || !passwordConfirm.dirty) return null;

    if (
      password.value != passwordConfirm.value &&
      !passwordConfirm.hasError('passwordsMismatch')
    )
      passwordConfirm.setErrors({ passwordsMismatch: true });
    else if (
      password.value == passwordConfirm.value &&
      passwordConfirm.hasError('passwordsMismatch')
    )
      passwordConfirm.setErrors({ passwordsMismatch: false });

    return null;
  }

  onSubmit(): void {
    if (this.settingsForm?.valid !== true || this.user == undefined) return;

    if (this.password != undefined && this.password.value.length !== 0)
      this.user.password = this.password?.value;

    this.userService.updateUser(this.user).subscribe((user) => {
      this.user = user;
      this.settingsForm?.reset();
    });
  }

  get password(): AbstractControl | undefined | null {
    return this.settingsForm?.get('password');
  }

  get passwordConfirm(): AbstractControl | undefined | null {
    return this.settingsForm?.get('passwordConfirm');
  }

  get hasUnsavedChanges(): boolean {
    return (
      this.settingsForm?.touched === true &&
      this.password?.value.length !== 0 &&
      this.passwordConfirm?.value.length !== 0
    );
  }
}
