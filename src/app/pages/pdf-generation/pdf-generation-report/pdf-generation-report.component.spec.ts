import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfGenerationReportComponent } from './pdf-generation-report.component';

describe('PdfGenerationReportComponent', () => {
  let component: PdfGenerationReportComponent;
  let fixture: ComponentFixture<PdfGenerationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfGenerationReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfGenerationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
