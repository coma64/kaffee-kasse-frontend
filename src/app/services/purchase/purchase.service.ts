import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BeverageType } from '@models/beverage-type';
import { Purchase } from '@models/purchase';
import { PurchaseCount } from '@models/purchase-count';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import urlcat from 'urlcat';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private readonly url = `${environment.apiUrl}/purchases/`;
  private readonly countsUrl = `${environment.apiUrl}/purchases/counts/`;
  private readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  create(purchase: Purchase): Observable<Purchase> {
    return this.http
      .post<Purchase>(this.url, purchase, this.httpOptions)
      .pipe(map(this.parsePurchase));
  }

  getList(
    options: { userId?: number; order?: string } = {}
  ): Observable<Purchase[]> {
    const url = urlcat(this.url, {
      user: options?.userId,
      order: options?.order,
    });

    return this.http
      .get<Purchase[]>(url)
      .pipe(map((purchases) => purchases.map(this.parsePurchase)));
  }

  getCounts(
    options: { userId?: number; order?: string } = {}
  ): Observable<PurchaseCount[]> {
    const url = urlcat(this.countsUrl, {
      user: options?.userId,
      order: options?.order,
    });

    return this.http.get<{ beverage_type: string; count: number }[]>(url).pipe(
      switchMap((purchaseCounts) =>
        forkJoin(
          purchaseCounts.map((purchaseCount) =>
            this.http.get<BeverageType>(purchaseCount.beverage_type).pipe(
              map((beverageType) => {
                return {
                  beverageType: beverageType,
                  count: purchaseCount.count,
                };
              })
            )
          )
        )
      )
    );
  }

  private parsePurchase(purchase: Purchase): Purchase {
    purchase.date = new Date(purchase.date);
    return purchase;
  }
}
