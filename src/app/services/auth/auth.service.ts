import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Credentials } from '@models/credentials';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private credentialsSubject: BehaviorSubject<Credentials | undefined>;
  credentials$: Observable<Credentials | undefined>;

  constructor(private router: Router, private http: HttpClient) {
    this.credentialsSubject = new BehaviorSubject<Credentials | undefined>(
      localStorage.getItem('credentials') !== null
        ? JSON.parse(localStorage.getItem('credentials') as string)
        : undefined
    );
    this.credentials$ = this.credentialsSubject.asObservable();
  }

  public get credentials(): Credentials | undefined {
    return this.credentialsSubject.value;
  }

  public get isLoggedIn(): boolean {
    return this.credentials !== undefined;
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http
      .post<{ token?: string; non_field_errors?: string[], username?: string[], password?: string[] }>(
        '/api-token-auth/',
        { username, password }
      )
      .pipe(
        map((response) => {
          if (response.token === undefined) return false;

          const credentials: Credentials = {
            token: response.token
          };
          localStorage.setItem('credentials', JSON.stringify(credentials));
          this.credentialsSubject.next(credentials);

          return true;
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400)
            return of(false);

          return throwError(error);
        })
      );
  }

  logout() {
    localStorage.removeItem('credentials');
    this.credentialsSubject.next(undefined);

    this.router.navigate(['/login']);
  }
}
