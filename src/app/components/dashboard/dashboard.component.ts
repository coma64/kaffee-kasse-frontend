import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BeverageType } from '@models/beverage-type';
import { Profile } from '@models/profile';
import { Purchase } from '@models/purchase';
import { User } from '@models/user';
import { AuthService } from '@services/auth/auth.service';
import { BeverageTypeService } from '@services/beverageType/beverage-type.service';
import { ProfileService } from '@services/profile/profile.service';
import { PurchaseService } from '@services/purchase/purchase.service';
import { UserService } from '@services/user/user.service';
import { forkJoin, Observable } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  currentProfile?: Profile;
  beverageTypes: BeverageType[] = [];
  purchases: Purchase[] = [];
  purchaseForm = new FormGroup({
    beverageType: new FormControl(),
    amount: new FormControl(1),
  });

  Math = Math;

  constructor(
    private userService: UserService,
    private profileService: ProfileService,
    private purchaseService: PurchaseService,
    private beverageTypeService: BeverageTypeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.refreshProfile().subscribe();

    this.beverageTypeService
      .getBeverageTypes()
      .subscribe((beverageTypes) => (this.beverageTypes = beverageTypes));

    this.refreshPurchases().subscribe();
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
        switchMap(() => this.refreshProfile()),
        switchMap(() => this.refreshPurchases())
      )
      .subscribe(() => {
        this.purchaseForm.setValue({
          amount: 1,
          beverageType: null,
        });
      });
  }

  private refreshProfile(): Observable<Profile> {
    return this.userService.currentUser$.pipe(
      filter((user) => user != undefined),
      switchMap(
        (user) =>
          this.profileService.getProfile(
            user?.profile as string
          ) as Observable<Profile>
      ),
      tap((profile) => (this.currentProfile = profile))
    );
  }

  private refreshPurchases(): Observable<Purchase[]> {
    return this.userService.currentUser$.pipe(
      filter((user) => user != undefined),
      switchMap((user) => this.purchaseService.getPurchases(user as User)),
      tap((purchases) => (this.purchases = purchases))
    );
  }

  getPurchaseBeverageType(purchase: Purchase): BeverageType {
    return this.beverageTypes[
      this.beverageTypeService.getBeverageTypeIdByUrl(purchase.beverage_type) -
        1
    ];
  }
}
