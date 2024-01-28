import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoContestComponent } from './photo-contest.component';

describe('PhotoContestComponent', () => {
  let component: PhotoContestComponent;
  let fixture: ComponentFixture<PhotoContestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotoContestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoContestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
