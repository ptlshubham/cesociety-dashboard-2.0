import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroDonationComponent } from './micro-donation.component';

describe('MicroDonationComponent', () => {
  let component: MicroDonationComponent;
  let fixture: ComponentFixture<MicroDonationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MicroDonationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MicroDonationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
