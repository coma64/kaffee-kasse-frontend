import { TestBed } from '@angular/core/testing';

import { TokenAuthInterceptor } from './token-auth.interceptor';

describe('TokenAuthInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      TokenAuthInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: TokenAuthInterceptor = TestBed.inject(TokenAuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
