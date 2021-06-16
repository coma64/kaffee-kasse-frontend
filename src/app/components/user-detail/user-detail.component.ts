import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BeverageType } from '@models/beverage-type';
import { Profile } from '@models/profile';
import { Purchase } from '@models/purchase';
import { User } from '@models/user';
import { BeverageTypeService } from '@services/beverageType/beverage-type.service';
import { ProfileService } from '@services/profile/profile.service';
import { PurchaseService } from '@services/purchase/purchase.service';
import { UserService } from '@services/user/user.service';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  OperatorFunction,
  zip,
} from 'rxjs';
import { filter, map, mapTo, shareReplay, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  userId$!: Observable<number>;
  user$!: Observable<User>;
  currentUser$!: Observable<User>;
  profile$!: Observable<Profile>;
  beverageTypes$!: Observable<BeverageType[]>;
  purchasesFromUser$!: Observable<Purchase[]>;
  wastedMoney$!: Observable<number>;
  purchasesByBeverageType$!: Observable<
    {
      beverageType: BeverageType;
      amount: number;
    }[]
  >;
  pageHasLoaded$ = new BehaviorSubject<boolean>(false);

  constructor(
    private userService: UserService,
    private profileService: ProfileService,
    private purchaseService: PurchaseService,
    private beverageTypeService: BeverageTypeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId$ = this.route.paramMap.pipe(
      map((params) => parseInt(params.get('id') ?? ''))
    );

    this.userId$.subscribe((id) => isNaN(id) && this.router.navigate(['']));
    this.userId$.pipe(mapTo(false)).subscribe(this.pageHasLoaded$);

    const user$ = this.userId$.pipe(
      filter((id) => !isNaN(id)),
      switchMap((id) => this.userService.getUser(id)),
      shareReplay(1)
    );
    user$.subscribe((user) => {
      if (user == undefined) this.router.navigate(['']);
    });

    this.user$ = user$.pipe(
      filter((user) => user != undefined) as OperatorFunction<
        User | undefined,
        User
      >
    );

    this.currentUser$ = this.userService.getMe().pipe(shareReplay(1));

    this.profile$ = this.user$.pipe(
      switchMap(
        (user) =>
          this.profileService.getProfile(user.profile) as Observable<Profile>
      ),
      shareReplay(1)
    );

    // Depend on user$ to refresh everything on user change
    this.beverageTypes$ = this.user$.pipe(
      switchMap(() => this.beverageTypeService.getBeverageTypes()),
      shareReplay(1)
    );

    this.purchasesFromUser$ = this.user$.pipe(
      switchMap((user) => this.purchaseService.getList({ userId: user.id })),
      shareReplay(1)
    );

    this.wastedMoney$ = combineLatest([
      this.purchasesFromUser$,
      this.beverageTypes$,
    ]).pipe(
      map(([purchases, beverageTypes]) => {
        return purchases
          .map((purchase) => {
            const beverageTypeId =
              this.beverageTypeService.getBeverageTypeIdByUrl(
                purchase.beverage_type
              );
            return {
              purchase,
              beverageType: beverageTypes[beverageTypeId - 1],
            };
          })
          .reduce(
            (wastedMoney, purchase) =>
              wastedMoney + purchase.beverageType.price,
            0.0
          );
      }),
      shareReplay(1)
    );

    this.purchasesByBeverageType$ = combineLatest([
      this.beverageTypes$,
      this.purchasesFromUser$,
    ]).pipe(
      map(([beverageTypes, purchases]) =>
        beverageTypes
          .map((beverageType) => {
            return {
              beverageType,
              amount: purchases.reduce(
                (count, purchase) =>
                  purchase.beverage_type.lastIndexOf(
                    String(beverageType.id)
                  ) !== -1
                    ? count + 1
                    : count,
                0
              ),
            };
          })
          .sort((a, b) => b.amount - a.amount)
      )
    );

    zip(
      this.user$,
      this.user$.pipe(switchMap(() => this.currentUser$)),
      this.profile$,
      this.beverageTypes$,
      this.purchasesFromUser$,
      this.wastedMoney$,
      this.purchasesByBeverageType$
    )
      .pipe(mapTo(true))
      .subscribe(this.pageHasLoaded$);
  }

  getBeverageClass(index: number): string {
    switch (index) {
      case 0:
        return 'no-1-beverage';
      case 1:
        return 'no-2-beverage';
      case 2:
        return 'no-3-beverage';
    }
    return '';
  }
}
