import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTokensComponent } from './request-tokens.component';

describe('RequestTokensComponent', () => {
  let component: RequestTokensComponent;
  let fixture: ComponentFixture<RequestTokensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestTokensComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
