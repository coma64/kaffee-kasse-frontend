import { Injectable } from '@angular/core';
import { PurchaseCount } from '@models/purchase-count';
import { User } from '@models/user';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  topUsers = new ReplaySubject<User[]>(1);
  purchaseCounts = new ReplaySubject<PurchaseCount[]>(1);
}
