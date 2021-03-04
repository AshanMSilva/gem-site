import { TestBed } from '@angular/core/testing';

import { GemReportService } from './gem-report.service';

describe('GemReportService', () => {
  let service: GemReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GemReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
