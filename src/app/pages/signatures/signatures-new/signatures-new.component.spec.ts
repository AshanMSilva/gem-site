import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignaturesNewComponent } from './signatures-new.component';

describe('SignaturesNewComponent', () => {
  let component: SignaturesNewComponent;
  let fixture: ComponentFixture<SignaturesNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignaturesNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignaturesNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
