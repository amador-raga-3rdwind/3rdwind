import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DhaInfoComponent } from './dha-info.component';

describe('DhaInfoComponent', () => {
  let component: DhaInfoComponent;
  let fixture: ComponentFixture<DhaInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DhaInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DhaInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
