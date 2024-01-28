import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from 'src/app/core/services/home.services';

@Component({
  selector: 'app-comm-details',
  templateUrl: './comm-details.component.html',
  styleUrls: ['./comm-details.component.scss']
})
export class CommDetailsComponent implements OnInit {
  commDetails: any = [];
  commi: any = {};
  commMulti: any = [];
  infraId: any;
  showNavigationIndicators: any;
  commData: any = [];
  constructor(
    private homeService: HomeService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.infraId = params['id'];
      this.getCommDataById();
    });
  }
  ngOnInit(): void {
  }
  getCommDataById() {
    this.homeService.getCommeteeDetails(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.commDetails = res;
      this.getCommMultiImages();
      this.commDetails.forEach((element: any) => {
        if (element.id == this.infraId) {
          this.commi = element;
          this.commData.push(element.commImage)
        }
      });
    })
  }
  getCommMultiImages() {
    this.homeService.getCommiteeMultiImageById(this.infraId).subscribe((res: any) => {
      this.commMulti = res;
      if (this.commMulti.length > 0) {
        this.commMulti.forEach((element: any) => {
          this.commData.push(element.image);
        });
      }
    })
  }
}
