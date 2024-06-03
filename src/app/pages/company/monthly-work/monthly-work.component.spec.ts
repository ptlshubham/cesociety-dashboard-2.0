import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyWorkComponent } from './monthly-work.component';

describe('MonthlyWorkComponent', () => {
  let component: MonthlyWorkComponent;
  let fixture: ComponentFixture<MonthlyWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonthlyWorkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonthlyWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
