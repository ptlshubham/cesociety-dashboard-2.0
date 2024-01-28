import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationBulkUploadComponent } from './donation-bulk-upload.component';

describe('DonationBulkUploadComponent', () => {
  let component: DonationBulkUploadComponent;
  let fixture: ComponentFixture<DonationBulkUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonationBulkUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonationBulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
