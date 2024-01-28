import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RahotkarshBulkUploadComponent } from './rahotkarsh-bulk-upload.component';

describe('RahotkarshBulkUploadComponent', () => {
  let component: RahotkarshBulkUploadComponent;
  let fixture: ComponentFixture<RahotkarshBulkUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RahotkarshBulkUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RahotkarshBulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
