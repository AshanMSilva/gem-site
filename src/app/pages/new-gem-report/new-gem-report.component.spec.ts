import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGemReportComponent } from './new-gem-report.component';

describe('NewGemReportComponent', () => {
  let component: NewGemReportComponent;
  let fixture: ComponentFixture<NewGemReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewGemReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewGemReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
