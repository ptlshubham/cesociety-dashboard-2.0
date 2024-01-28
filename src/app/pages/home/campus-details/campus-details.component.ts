import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from 'src/app/core/services/home.services';

@Component({
  selector: 'app-campus-details',
  templateUrl: './campus-details.component.html',
  styleUrls: ['./campus-details.component.scss']
})
export class CampusDetailsComponent implements OnInit {

  campusDetails: any = [];
  commi: any = {};
  campusMulti: any = [];
  infraId: any;
  showNavigationIndicators: any;
  campusData: any = [];
  constructor(
    private homeService: HomeService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.infraId = params['id'];
      this.getCampusDataById();
    });
  }
  ngOnInit(): void {
  }
  getCampusDataById() {
    this.homeService.getCampusDetails(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.campusDetails = res;
      this.getcampusMultiImages();
      this.campusDetails.forEach((element: any) => {
        if (element.id == this.infraId) {
          this.commi = element;
          this.campusData.push(element.campusImage)
        }
      });
    })
  }
  getcampusMultiImages() {
    this.homeService.getCampusMultiImageById(this.infraId).subscribe((res: any) => {
      this.campusMulti = res;
      if (this.campusMulti.length > 0) {
        this.campusMulti.forEach((element: any) => {
          this.campusData.push(element.image);
        });
      }
    })
  }

}
