import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlySchedulerComponent } from './monthly-scheduler.component';

describe('MonthlySchedulerComponent', () => {
  let component: MonthlySchedulerComponent;
  let fixture: ComponentFixture<MonthlySchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonthlySchedulerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonthlySchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
