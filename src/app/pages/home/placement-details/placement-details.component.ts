import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from 'src/app/core/services/home.services';

@Component({
  selector: 'app-placement-details',
  templateUrl: './placement-details.component.html',
  styleUrls: ['./placement-details.component.scss']
})
export class PlacementDetailsComponent implements OnInit {
  placeDetails: any = [];
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
    this.homeService.getPlacementDetails(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.placeDetails = res;
      this.getplaceMultiImages();
      this.placeDetails.forEach((element: any) => {
        if (element.id == this.infraId) {
          this.commi = element;
          this.commData.push(element.placeImage)
        }
      });
    })
  }
  getplaceMultiImages() {
    this.homeService.getPlacementMultiImageById(this.infraId).subscribe((res: any) => {
      this.placeMulti = res;
      if (this.placeMulti.length > 0) {
        this.placeMulti.forEach((element: any) => {
          this.commData.push(element.image);
        });
      }
    })
  }

}
