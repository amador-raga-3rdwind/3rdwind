import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencySectionsComponent } from './agency-sections.component';

describe('AgencySectionsComponent', () => {
  let component: AgencySectionsComponent;
  let fixture: ComponentFixture<AgencySectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgencySectionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgencySectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
