import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RahotkarshComponent } from './rahotkarsh.component';

describe('RahotkarshComponent', () => {
  let component: RahotkarshComponent;
  let fixture: ComponentFixture<RahotkarshComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RahotkarshComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RahotkarshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
