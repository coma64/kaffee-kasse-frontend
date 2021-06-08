import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BeverageType } from '@models/beverage-type';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, mapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BeverageTypeService {
  private readonly beverageTypesUrl = `${environment.apiUrl}/beverage-types`;
  private readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  getBeverageTypes(): Observable<BeverageType[]> {
    return this.http
      .get<BeverageType[]>(`${this.beverageTypesUrl}/`)
      .pipe(map((beverageTypes) => beverageTypes.map(this.parseBeverageType)));
  }

  updateBeverageType(beverageType: BeverageType): Observable<BeverageType> {
    return this.http
      .patch<BeverageType>(
        `${this.beverageTypesUrl}/${beverageType.id}/`,
        beverageType,
        this.httpOptions
      )
      .pipe(map(this.parseBeverageType));
  }

  createBeverageType(beverageType: BeverageType): Observable<BeverageType> {
    return this.http
      .post<BeverageType>(
        `${this.beverageTypesUrl}/`,
        beverageType,
        this.httpOptions
      )
      .pipe(map(this.parseBeverageType));
  }

  deleteBeverageType(id: number): Observable<number | undefined> {
    return this.http.delete(`${this.beverageTypesUrl}/${id}/`).pipe(
      mapTo(id),
      catchError((err: HttpErrorResponse) =>
        err.status === 404 ? of(undefined) : throwError(err)
      )
    );
  }

  getBeverageTypeUrl(beverageType: BeverageType): string {
    return `${this.beverageTypesUrl}/${beverageType.id}/`;
  }

  getBeverageTypeIdByUrl(url: string): number {
    return Number(url.slice(this.beverageTypesUrl.length + 1, -1));
  }

  private parseBeverageType(beverageType: BeverageType): BeverageType {
    beverageType.price = parseFloat(beverageType.price as unknown as string);
    return beverageType;
  }
}
