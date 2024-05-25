import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPostSchedulerComponent } from './client-post-scheduler.component';

describe('ClientPostSchedulerComponent', () => {
  let component: ClientPostSchedulerComponent;
  let fixture: ComponentFixture<ClientPostSchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientPostSchedulerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientPostSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
