import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GemDetailsNewComponent } from './gem-details-new.component';

describe('GemDetailsNewComponent', () => {
  let component: GemDetailsNewComponent;
  let fixture: ComponentFixture<GemDetailsNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GemDetailsNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GemDetailsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
