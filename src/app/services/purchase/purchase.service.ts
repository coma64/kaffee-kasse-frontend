import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Purchase } from '@models/purchase';
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

  }

  private parsePurchase(purchase: Purchase): Purchase {
    purchase.date = new Date(purchase.date);
    return purchase;
  }
}
