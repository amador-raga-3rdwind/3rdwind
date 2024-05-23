import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DhsInfoComponent } from './dhs-info.component';

describe('DhsInfoComponent', () => {
  let component: DhsInfoComponent;
  let fixture: ComponentFixture<DhsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DhsInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DhsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
