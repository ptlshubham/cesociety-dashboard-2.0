import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/core/services/home.services';

@Component({
  selector: 'app-gate-pass',
  templateUrl: './gate-pass.component.html',
  styleUrls: ['./gate-pass.component.scss']
})
export class GatePassComponent implements OnInit {
  gatePassData: any = [];

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];
  filterData: any = [];
  role: any;
  constructor(
    private homeService: HomeService
  ) {
  }

  ngOnInit(): void {
    this.role = 'all';
    this.getGatePassDetails();
  }
  changeRole(val: any) {
    this.filterData = [];
    this.role = val.target.value;
    
    this.getGatePassDetails();
  }
  getGatePassDetails() {
    this.homeService.getGatePassData().subscribe((res: any) => {
      this.gatePassData = res;
      if(this.role=='all'){
        this.filterData = res;
      }
      else{
        this.gatePassData.forEach((element: any) => {
          if (element.role == this.role) {
            this.filterData.push(element)
          }
        });
      }
      for (let i = 0; i < this.filterData.length; i++) {
        this.filterData[i].index = i + 1;
      }
      this.collectionSize = this.filterData.length;
      this.getPagintaion();
    })
  }
  getPagintaion() {
    this.paginateData = this.filterData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
}
