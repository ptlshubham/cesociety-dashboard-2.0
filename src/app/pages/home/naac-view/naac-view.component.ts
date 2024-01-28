import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from 'src/app/core/services/home.services';

@Component({
  selector: 'app-naac-view',
  templateUrl: './naac-view.component.html',
  styleUrls: ['./naac-view.component.scss']
})
export class NaacViewComponent implements OnInit {
  naacId: any;
  NaacData: any = [];
  NaacObject: any = {};
  constructor(
    private activatedRoute: ActivatedRoute,
    private homeService: HomeService
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.naacId = params['id'];
    });
  }

  ngOnInit(): void {
    this.homeService.getNewNaacDetails(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.NaacData = res;
      this.NaacData.forEach((element: any) => {
        debugger
        if (element.id == this.naacId) {
          this.NaacObject = {
            id: element.id,
            criteria: element.criteria,
            details: element.details,
            instituteId: element.instituteId
          }
        }
      });
    })
  }


}
