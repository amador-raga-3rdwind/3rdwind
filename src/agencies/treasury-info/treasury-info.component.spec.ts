import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreasuryInfoComponent } from './treasury-info.component';

describe('TreasuryInfoComponent', () => {
  let component: TreasuryInfoComponent;
  let fixture: ComponentFixture<TreasuryInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreasuryInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TreasuryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
