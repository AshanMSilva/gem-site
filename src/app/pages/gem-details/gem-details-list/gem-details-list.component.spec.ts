import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GemDetailsListComponent } from './gem-details-list.component';

describe('GemDetailsListComponent', () => {
  let component: GemDetailsListComponent;
  let fixture: ComponentFixture<GemDetailsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GemDetailsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GemDetailsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
