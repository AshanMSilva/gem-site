import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectReportTypeComponent } from './select-report-type.component';

describe('SelectReportTypeComponent', () => {
  let component: SelectReportTypeComponent;
  let fixture: ComponentFixture<SelectReportTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectReportTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectReportTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
