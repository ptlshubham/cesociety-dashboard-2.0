import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from 'src/app/core/services/home.services';

@Component({
  selector: 'app-department-details',
  templateUrl: './department-details.component.html',
  styleUrl: './department-details.component.scss'
})
export class DepartmentDetailsComponent {
  depDetails: any = [];
  dep: any = {};
  depMulti: any = [];
  depId: any;
  showNavigationIndicators: any;
  depData: any = [];
  constructor(
    private homeService: HomeService,
    private activatedRoute: ActivatedRoute
  ) {
    debugger

    this.activatedRoute.params.subscribe(params => {
      this.depId = params['id'];
      this.getdepDataById();
      debugger
    });
  }
  ngOnInit(): void {
  }
  getdepDataById() {
    this.homeService.getDepartmentDataById(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.depDetails = res;
      this.getdepMultiImages();
      this.depDetails.forEach((element: any) => {
        if (element.id == this.depId) {
          this.dep = element;
          this.depData.push(element.depimage)
        }
      });
    })
  }
  getdepMultiImages() {
    this.homeService.getDepMultiImageById(this.depId).subscribe((res: any) => {
      this.depMulti = res;
      if (this.depMulti.length > 0) {
        this.depMulti.forEach((element: any) => {
          this.depData.push(element.image);
        });
      }
    })
  }
  
}
