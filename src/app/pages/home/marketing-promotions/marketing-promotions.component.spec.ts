import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingPromotionsComponent } from './marketing-promotions.component';

describe('MarketingPromotionsComponent', () => {
  let component: MarketingPromotionsComponent;
  let fixture: ComponentFixture<MarketingPromotionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MarketingPromotionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MarketingPromotionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
