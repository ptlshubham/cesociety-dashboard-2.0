import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaacViewComponent } from './naac-view.component';

describe('NaacViewComponent', () => {
  let component: NaacViewComponent;
  let fixture: ComponentFixture<NaacViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NaacViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NaacViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
