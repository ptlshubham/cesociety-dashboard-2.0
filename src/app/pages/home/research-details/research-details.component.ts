import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from 'src/app/core/services/home.services';

@Component({
  selector: 'app-research-details',
  templateUrl: './research-details.component.html',
  styleUrls: ['./research-details.component.scss']
})
export class ResearchDetailsComponent implements OnInit {

  researchDetails: any = [];
  commi: any = {};
  placeMulti: any = [];
  infraId: any;
  showNavigationIndicators: any;
  commData: any = [];
  constructor(
    private homeService: HomeService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.infraId = params['id'];
      this.getPlaceDataById();
    });
  }
  ngOnInit(): void {
  }
  getPlaceDataById() {
    this.homeService.getResearchDetails(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.researchDetails = res;
      this.researchDetails.forEach((element: any) => {
        if (element.id == this.infraId) {
          this.commi = element;
          // this.commData.push(element.placeImage)
        }
      });
    })
  }
  // getplaceMultiImages() {
  //   this.homeService.getPlacementMultiImageById(this.infraId).subscribe((res: any) => {
  //     this.placeMulti = res;
  //     if (this.placeMulti.length > 0) {
  //       this.placeMulti.forEach((element: any) => {
  //         this.commData.push(element.image);
  //       });
  //     }
  //   })
  // }
}
