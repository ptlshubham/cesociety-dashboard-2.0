import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaacMainComponent } from './naac-main.component';

describe('NaacMainComponent', () => {
  let component: NaacMainComponent;
  let fixture: ComponentFixture<NaacMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NaacMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NaacMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
