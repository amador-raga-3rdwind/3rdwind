import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiProtoComponent } from './api-proto.component';

describe('ApiProtoComponent', () => {
  let component: ApiProtoComponent;
  let fixture: ComponentFixture<ApiProtoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiProtoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApiProtoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
