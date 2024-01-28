import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from 'src/app/core/services/home.services';

@Component({
  selector: 'app-infra-details',
  templateUrl: './infra-details.component.html',
  styleUrls: ['./infra-details.component.scss']
})
export class InfraDetailsComponent implements OnInit {
  infraDetails: any = [];
  infra: any = {};
  infraMulti: any = [];
  infraId: any;
  showNavigationIndicators: any;
  infraData: any = [];
  constructor(
    private homeService: HomeService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.infraId = params['id'];
      this.getInfraDataById();
    });
  }
  ngOnInit(): void {
  }
  getInfraDataById() {
    this.homeService.getImfraDetails(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.infraDetails = res;
      this.getInfraMultiImages();
      this.infraDetails.forEach((element: any) => {
        if (element.id == this.infraId) {
          this.infra = element;
          this.infraData.push(element.infraImage)
        }
      });
    })
  }
  getInfraMultiImages() {
    this.homeService.getInfraMultiImageById(this.infraId).subscribe((res: any) => {
      this.infraMulti = res;
      if (this.infraMulti.length > 0) {
        this.infraMulti.forEach((element: any) => {
          this.infraData.push(element.image);
        });
      }
    })
  }
}
