import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BeverageType } from '@models/beverage-type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BeverageTypeService {
  private readonly beverageTypesUrl = `${environment.apiUrl}/beverage-types`;
  private readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) { }

  getBeverageTypes(): Observable<BeverageType[]> {
    return this.http.get<BeverageType[]>(`${this.beverageTypesUrl}/`);
  }
}
