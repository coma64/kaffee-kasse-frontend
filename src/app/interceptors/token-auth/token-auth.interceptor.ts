import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { AuthService } from '@services/auth/auth.service';

@Injectable()
export class TokenAuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const isApiUrl = request.url.startsWith(environment.apiUrl);

    const credentials = this.authService.credentials;
    const isLoggedIn = credentials !== undefined;

    if (isLoggedIn && isApiUrl)
      request = request.clone({
        setHeaders: {
          Authorization: `Token ${credentials?.token}`,
        },
      });

    return next.handle(request);
  }
}
