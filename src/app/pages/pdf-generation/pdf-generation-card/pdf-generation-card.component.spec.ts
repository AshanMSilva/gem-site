import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfGenerationCardComponent } from './pdf-generation-card.component';

describe('PdfGenerationCardComponent', () => {
  let component: PdfGenerationCardComponent;
  let fixture: ComponentFixture<PdfGenerationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfGenerationCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfGenerationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
