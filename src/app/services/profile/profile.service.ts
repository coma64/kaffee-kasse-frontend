import { Injectable } from '@angular/core';
import { Profile } from '@models/profile';
import { environment } from '@environments/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly profilesUrl = `${environment.apiUrl}/profiles`;
  private readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  getProfile(id: string | number): Observable<Profile | undefined> {
    return this.http
      .get<Profile>(typeof id === 'string' ? id : `${this.profilesUrl}/${id}/`)
      .pipe(
        map(this.parseProfile),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) return of(undefined);

          return throwError(error);
        })
      );
  }

  getProfiles(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.profilesUrl}/`);
  }

  addBalance(id: number, balanceAdd: number): Observable<Profile> {
    return this.http
      .patch<Profile>(
        `${this.profilesUrl}/${id}/add-balance/`,
        { balance: balanceAdd },
        this.httpOptions
      )
      .pipe(map(this.parseProfile));
  }

  getProfileIdByUrl(url: string): number | undefined {
    const id = Number(url.slice(this.profilesUrl.length + 1, -1));
    return isNaN(id) ? undefined : id;
  }

  private parseProfile(profile: Profile): Profile {
    profile.balance = parseFloat(profile.balance as unknown as string);
    return profile;
  }
}
