import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environments/environment';
import { Profile } from '@models/profile';
import { User } from '@models/user';
import { ProfileService } from '@services/profile/profile.service';
import { UserService } from '@services/user/user.service';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-admin-user-detail',
  templateUrl: './admin-user-detail.component.html',
})
export class AdminUserDetailComponent implements OnInit {
  user?: User;
  profile?: Profile;
  settingsForm?: FormGroup;
  balanceForm?: FormGroup;
  balanceChange = 0;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = parseInt(params.get('id') as string);
          return forkJoin([
            this.userService.getUser(id),
            this.profileService.getProfile(id),
          ]);
        })
      )
      .subscribe(([user, profile]) => {
        if (user == undefined || profile == undefined) {
          this.router.navigate(['']);
        } else {
          this.user = user;
          this.profile = profile;

          this.initSettingsForm();
          this.initBalanceForm();
        }
      });
  }

  private initSettingsForm(): void {
    this.settingsForm = this.formBuilder.group(
      {
        password: [
          '',
          [Validators.minLength(environment.passwordMinimumLength)],
        ],
        passwordConfirm: [
          '',
          [Validators.minLength(environment.passwordMinimumLength)],
        ],
      },
      {
        validators: [this.passwordsMatch],
      }
    );
  }

  private initBalanceForm(): void {
    this.balanceForm = this.formBuilder.group({
      balanceAdd: [0, Validators.required],
      balanceReduce: [0, Validators.required],
    });
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

  onBalanceInput(): void {
    const balanceAdd = parseFloat(this.balanceAdd?.value || 0);
    const balanceReduce = parseFloat(this.balanceReduce?.value || 0);

    this.balanceChange = balanceAdd - balanceReduce;
  }

  onBalanceSubmit(): void {
    if (this.profile == undefined) return;

    const balanceChange = this.balanceChange;

    this.profileService
      .addBalance(this.profile.id, this.balanceChange)
      .subscribe(() => {
        if (
          this.profile == undefined ||
          this.balanceAdd == undefined ||
          this.balanceReduce == undefined
        )
          return;

        this.profile.balance = this.profile.balance + balanceChange;
        this.balanceAdd.setValue(0);
        this.balanceReduce.setValue(0);
      });
  }

  get password(): AbstractControl | undefined | null {
    return this.settingsForm?.get('password');
  }

  get passwordConfirm(): AbstractControl | undefined | null {
    return this.settingsForm?.get('passwordConfirm');
  }

  get balanceAdd(): AbstractControl | undefined {
    return this.balanceForm?.get('balanceAdd') || undefined;
  }

  get balanceReduce(): AbstractControl | undefined {
    return this.balanceForm?.get('balanceReduce') || undefined;
  }

  get hasUnsavedChanges(): boolean {
    return (
      this.settingsForm?.touched === true &&
      this.password?.value.length !== 0 &&
      this.passwordConfirm?.value.length !== 0
    );
  }
}
