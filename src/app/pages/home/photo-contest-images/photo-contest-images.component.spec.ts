import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoContestImagesComponent } from './photo-contest-images.component';

describe('PhotoContestImagesComponent', () => {
  let component: PhotoContestImagesComponent;
  let fixture: ComponentFixture<PhotoContestImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotoContestImagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoContestImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
