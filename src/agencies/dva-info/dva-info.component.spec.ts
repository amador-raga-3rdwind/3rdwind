import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DvaInfoComponent } from './dva-info.component';

describe('DvaInfoComponent', () => {
  let component: DvaInfoComponent;
  let fixture: ComponentFixture<DvaInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DvaInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DvaInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
