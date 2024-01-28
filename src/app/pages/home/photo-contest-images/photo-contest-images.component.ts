import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from 'src/app/core/services/home.services';

@Component({
  selector: 'app-photo-contest-images',
  templateUrl: './photo-contest-images.component.html',
  styleUrls: ['./photo-contest-images.component.scss']
})
export class PhotoContestImagesComponent implements OnInit {
  contestData: any = [];
  contestImages: any = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private homeService: HomeService,

  ) {
    this.activatedRoute.queryParams.subscribe((res: any) => {
      this.contestData = JSON.parse(res.data);
    })
  }

  ngOnInit(): void {
    this.getContestImages(this.contestData.id);
  }
  getContestImages(id: any) {
    this.homeService.getContestImages(id).subscribe((res: any) => {
      this.contestImages = res;
    })
  }
  downloadImage(url: string, fileName: string): void {
    this.homeService.downloadImage(url).subscribe(blob => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    });
  }
}
