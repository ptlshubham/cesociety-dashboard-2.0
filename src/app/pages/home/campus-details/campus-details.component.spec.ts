import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampusDetailsComponent } from './campus-details.component';

describe('CampusDetailsComponent', () => {
  let component: CampusDetailsComponent;
  let fixture: ComponentFixture<CampusDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampusDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampusDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
