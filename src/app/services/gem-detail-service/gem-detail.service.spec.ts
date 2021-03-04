import { TestBed } from '@angular/core/testing';

import { GemDetailService } from './gem-detail.service';

describe('GemDetailService', () => {
  let service: GemDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GemDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
