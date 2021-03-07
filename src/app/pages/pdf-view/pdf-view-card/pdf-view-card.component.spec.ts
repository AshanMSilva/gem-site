import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfViewCardComponent } from './pdf-view-card.component';

describe('PdfViewCardComponent', () => {
  let component: PdfViewCardComponent;
  let fixture: ComponentFixture<PdfViewCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfViewCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfViewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
