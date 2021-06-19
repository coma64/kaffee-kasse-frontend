import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BeverageType } from '@models/beverage-type';
import { Profile } from '@models/profile';
import { Purchase } from '@models/purchase';
import { User } from '@models/user';
import { BeverageTypeService } from '@services/beverageType/beverage-type.service';
import { ProfileService } from '@services/profile/profile.service';
import { PurchaseService } from '@services/purchase/purchase.service';
import { UserService } from '@services/user/user.service';
import { forkJoin, Observable, OperatorFunction } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  private readonly topUsersCount = 10;

  currentProfile?: Profile;
  previousBalance = 0;
  beverageTypes: BeverageType[] = [];
  purchases: Purchase[] = [];
  purchaseForm = new FormGroup({
    beverageType: new FormControl(),
    amount: new FormControl(1),
  });
  windowWidth?: number;
  topUsers?: User[];

  Math = Math;

  constructor(
    private userService: UserService,
    private profileService: ProfileService,
    private purchaseService: PurchaseService,
    private beverageTypeService: BeverageTypeService
  ) {}

  ngOnInit(): void {
    this.refreshProfile().subscribe();

    this.beverageTypeService
      .getBeverageTypes()
      .subscribe((beverageTypes) => (this.beverageTypes = beverageTypes));

    this.refreshPurchases().subscribe();

    this.refreshTopUsers().subscribe();
  }

  private refreshTopUsers(): Observable<User[]> {
    return this.userService.getUsers('-purchases').pipe(
      map((users) => users.slice(0, this.topUsersCount)),
      tap((users) => (this.topUsers = users))
    );
  }

  ngAfterViewInit(): void {
    this.onResize();
  }

  @HostListener('window:resize')
  private onResize(): void {
    this.windowWidth = window.innerWidth;
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
      this.purchaseService.create({
        user: this.userService.currsentUserUrl,
        beverage_type: this.beverageTypeService.getBeverageTypeUrl(
          this.purchaseForm.value['beverageType']
        ),
      } as Purchase)
    );

    forkJoin(purchases)
      .pipe(
        switchMap(() => this.refreshProfile()),
        switchMap(() => this.refreshPurchases()),
        switchMap(() => this.refreshTopUsers())
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
      filter((user) => user != undefined) as OperatorFunction<
        User | undefined,
        User
      >,
      switchMap((user) =>
        this.purchaseService.getList({ userId: user.id, order: '-date' })
      ),
      tap((purchases) => (this.purchases = purchases))
    );
  }

  getPurchaseBeverageType(purchase: Purchase): BeverageType | undefined {
    const id = this.beverageTypeService.getBeverageTypeIdByUrl(
      purchase.beverage_type
    );
    return this.beverageTypes.find((beverageType) => beverageType.id === id);
  }
}
