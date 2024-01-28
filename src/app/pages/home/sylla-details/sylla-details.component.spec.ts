import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyllaDetailsComponent } from './sylla-details.component';

describe('SyllaDetailsComponent', () => {
  let component: SyllaDetailsComponent;
  let fixture: ComponentFixture<SyllaDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SyllaDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SyllaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
