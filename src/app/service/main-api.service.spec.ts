import { TestBed } from '@angular/core/testing';

import { MainAPIService } from './main-api.service';

describe('MainAPIService', () => {
  let service: MainAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
