import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from 'src/app/core/services/home.services';

@Component({
  selector: 'app-sylla-details',
  templateUrl: './sylla-details.component.html',
  styleUrls: ['./sylla-details.component.scss']
})
export class SyllaDetailsComponent implements OnInit {

  researchDetails: any = [];
  commi: any = {};
  sId: any;
  showNavigationIndicators: any;
  constructor(
    private homeService: HomeService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.sId = params['id'];
      this.getSyllabusDataById();
    });
  }
  ngOnInit(): void {
  }
  getSyllabusDataById() {
    this.homeService.getSyllabusDetails(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.researchDetails = res;
      this.researchDetails.forEach((element: any) => {
        if (element.id == this.sId) {
          this.commi = element;
        }
      });
    })
  }

}
