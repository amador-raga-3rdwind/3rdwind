import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpacePopComponent } from './space-pop.component';

describe('SpacePopComponent', () => {
  let component: SpacePopComponent;
  let fixture: ComponentFixture<SpacePopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpacePopComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpacePopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
