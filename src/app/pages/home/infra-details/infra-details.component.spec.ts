import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfraDetailsComponent } from './infra-details.component';

describe('InfraDetailsComponent', () => {
  let component: InfraDetailsComponent;
  let fixture: ComponentFixture<InfraDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfraDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfraDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
