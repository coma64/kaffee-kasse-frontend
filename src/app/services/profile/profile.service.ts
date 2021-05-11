import { Injectable } from '@angular/core';
import { Profile } from '@models/profile';
import { environment } from '@environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly profilesUrl = `${environment.apiUrl}/profiles`;
  private readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  getProfile(id: string | number): Observable<Profile | undefined> {
    return this.http.get<Profile>((typeof id === "string") ? id : `${this.profilesUrl}/${id}/`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404)
          return of(undefined);

        return throwError(error);
      }
      )
    )
  }
}
