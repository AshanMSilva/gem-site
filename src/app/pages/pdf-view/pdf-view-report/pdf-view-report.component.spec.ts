import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfViewReportComponent } from './pdf-view-report.component';

describe('PdfViewReportComponent', () => {
  let component: PdfViewReportComponent;
  let fixture: ComponentFixture<PdfViewReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfViewReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfViewReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
