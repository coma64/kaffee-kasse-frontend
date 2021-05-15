import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { User } from '@models/user';
import { AuthService } from '@services/auth/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersUrl = `${environment.apiUrl}/users`;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private currentUserSubject = new BehaviorSubject<User | undefined>(undefined);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    if (localStorage.getItem('currentUser') !== null) {
      this.currentUserSubject.next(
        JSON.parse(localStorage.getItem('currentUser') as string)
      )
    }

    this.authService.credentials$.subscribe(credentials => {
      if (credentials === undefined)
        this.logoutHook();
      else
        this.loginHook();
    })
  }

  public get currentUser(): User | undefined {
    return this.currentUserSubject.value;
  }

  public get currsentUserUrl(): string | undefined {
    return this.currentUser ? `${this.usersUrl}/${this.currentUser.id}/` : undefined;
  }

  private loginHook(): void {
    this.getMe().subscribe(user => {
      this.currentUserSubject.next(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
    })
  }

  private logoutHook(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(undefined);
  }

  getMe(): Observable<User> {
    return this.http
      .get<User>(`${this.usersUrl}/me/`)
      .pipe(map(this.parseUserDate));
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.usersUrl}/`, user, this.httpOptions);
  }

  private parseUserDate(user: User): User {
    user.date_joined = new Date(user.date_joined);
    return user;
  }
}


// code service and component together -> first user list
