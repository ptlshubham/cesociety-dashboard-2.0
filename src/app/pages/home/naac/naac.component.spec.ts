import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaacComponent } from './naac.component';

describe('NaacComponent', () => {
  let component: NaacComponent;
  let fixture: ComponentFixture<NaacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NaacComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NaacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
