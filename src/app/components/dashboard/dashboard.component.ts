import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { Profile } from '@models/profile';
import { Purchase } from '@models/purchase';
import { ProfileService } from '@services/profile/profile.service';
import { PurchaseService } from '@services/purchase/purchase.service';
import { UserService } from '@services/user/user.service';
import { forkJoin, of } from 'rxjs';
import { last, repeat, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  currentProfile?: Profile;
  Math = Math;

  constructor(
    private userService: UserService,
    private profileService: ProfileService,
    private purchaseService: PurchaseService
  ) {}

  ngOnInit() {
    this.userService.currentUser$
      .pipe(
        switchMap((user) =>
          user?.profile !== undefined
            ? this.profileService.getProfile(user.profile)
            : of(undefined)
        )
      )
      .subscribe((profile) => (this.currentProfile = profile));
  }

  createPurchase(amount: HTMLInputElement): void {
    if (this.userService.currsentUserUrl === undefined || isNaN(amount.valueAsNumber))
      return;

    const purchases = [...Array(amount.valueAsNumber)].map(() => this.purchaseService.createPurchase({user: this.userService.currsentUserUrl, beverage_type: `${environment.apiUrl}/beverage-types/1/`} as Purchase));
    // const purchases = this.purchaseService.createPurchase({user: this.userService.currsentUserUrl, beverage_type: `${environment.apiUrl}/beverage-types/1/`} as Purchase).pipe(repeat(amountNum), last());

    forkJoin(purchases).pipe(
      switchMap(() => this.userService.currentUser$),
      switchMap((user) =>
      user?.profile !== undefined
        ? this.profileService.getProfile(user.profile)
        : of(undefined)
      )
    ).subscribe(profile => {
      this.currentProfile = profile;
      amount.value = amount.defaultValue;
    });
  }


}
