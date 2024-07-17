import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XlsToJsonComponent } from './xls-to-json.component';

describe('XlsToJsonComponent', () => {
  let component: XlsToJsonComponent;
  let fixture: ComponentFixture<XlsToJsonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XlsToJsonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(XlsToJsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
