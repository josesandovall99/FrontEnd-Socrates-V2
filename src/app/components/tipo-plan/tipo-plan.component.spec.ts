import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoPlanComponent } from './tipo-plan.component';

describe('TipoPlanComponent', () => {
  let component: TipoPlanComponent;
  let fixture: ComponentFixture<TipoPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoPlanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TipoPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
