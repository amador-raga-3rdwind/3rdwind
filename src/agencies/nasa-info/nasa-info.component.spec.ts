import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NasaInfoComponent } from './nasa-info.component';

describe('NasaInfoComponent', () => {
  let component: NasaInfoComponent;
  let fixture: ComponentFixture<NasaInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NasaInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NasaInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
