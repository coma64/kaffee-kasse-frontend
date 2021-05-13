import { TestBed } from '@angular/core/testing';

import { BeverageTypeService } from './beverage-type.service';

describe('BeverageTypeService', () => {
  let service: BeverageTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeverageTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
