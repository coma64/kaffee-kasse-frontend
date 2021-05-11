import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Purchase } from '@models/purchase';
import { Observable } from 'rxjs';

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
}
