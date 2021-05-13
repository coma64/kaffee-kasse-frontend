import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from '@environments/environment';
import { BeverageType } from '@models/beverage-type';
import { Profile } from '@models/profile';
import { Purchase } from '@models/purchase';
import { BeverageTypeService } from '@services/beverageType/beverage-type.service';
import { ProfileService } from '@services/profile/profile.service';
import { PurchaseService } from '@services/purchase/purchase.service';
import { UserService } from '@services/user/user.service';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  currentProfile?: Profile;
  beverageTypes: BeverageType[] = [];
  purchaseForm = new FormGroup({
    beverageType: new FormControl(),
    amount: new FormControl(1),
  });

  Math = Math;

  constructor(
    private userService: UserService,
    private profileService: ProfileService,
    private purchaseService: PurchaseService,
    private beverageTypeService: BeverageTypeService
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

    this.beverageTypeService
      .getBeverageTypes()
      .subscribe((beverageTypes) => (this.beverageTypes = beverageTypes));
  }

  createPurchase(): void {
    if (
      this.userService.currsentUserUrl === undefined ||
      this.purchaseForm.value['amount'] == undefined ||
      this.purchaseForm.value['amount'] < 0 ||
      this.purchaseForm.value['beverageType'] == undefined
    )
      return;

    const purchases = [...Array(this.purchaseForm.value['amount'])].map(() =>
      this.purchaseService.createPurchase({
        user: this.userService.currsentUserUrl,
        beverage_type: this.beverageTypeService.getBeverageTypeUrl(
          this.purchaseForm.value['beverageType']
        ),
      } as Purchase)
    );

    forkJoin(purchases)
      .pipe(
        switchMap(() => this.userService.currentUser$),
        switchMap((user) =>
          user?.profile !== undefined
            ? this.profileService.getProfile(user.profile)
            : of(undefined)
        )
      )
      .subscribe((profile) => {
        this.currentProfile = profile;
        this.purchaseForm.setValue({
          amount: 1,
          beverageType: null,
        });
      });
  }
}
