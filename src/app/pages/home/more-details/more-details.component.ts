import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from 'src/app/core/services/home.services';

@Component({
  selector: 'app-more-details',
  templateUrl: './more-details.component.html',
  styleUrls: ['./more-details.component.scss']
})
export class MoreDetailsComponent implements OnInit {
  moreId: any;
  moreDetailsData: any = [];
  moreData: any = {};
  constructor(
    private homeService: HomeService,
    private activatedRoute: ActivatedRoute

  ) {
    this.activatedRoute.params.subscribe(params => {
      this.moreId = params['id'];
      this.getScholarshipData();
    });
  }

  ngOnInit(): void {
  }
  getScholarshipData() {
    this.homeService.getScholarshipData(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.moreDetailsData = res;
      this.moreDetailsData.forEach((element: any) => {
        if (element.id == this.moreId) {
          this.moreData = element;
        }

      });
    })
  }
}
