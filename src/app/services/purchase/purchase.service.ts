import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Purchase } from '@models/purchase';
import { User } from '@models/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private readonly purchasesUrl = `${environment.apiUrl}/purchases`;
  private readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) { }

  createPurchase(purchase: Purchase): Observable<Purchase> {
    return this.http.post<Purchase>(`${this.purchasesUrl}/`, purchase, this.httpOptions);
  }

  getPurchases(user?: User): Observable<Purchase[]> {
    let url = '';
    if (user !== undefined)
      url = `${this.purchasesUrl}/?user=${user.id}`;
    else
      url = `${this.purchasesUrl}/`;

    return this.http.get<Purchase[]>(url).pipe(
      map(purchases => purchases.map(this.parseDate))
    )
  }

  private parseDate(purchase: Purchase): Purchase {
    purchase.date = new Date(purchase.date);
    return purchase;
  }
}
