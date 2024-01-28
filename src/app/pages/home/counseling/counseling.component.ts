import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/core/services/home.services';

@Component({
  selector: 'app-counseling',
  templateUrl: './counseling.component.html',
  styleUrls: ['./counseling.component.scss']
})
export class CounselingComponent implements OnInit {
  counselingData: any = [];

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];
  constructor(
    private homeService: HomeService

  ) {
    this.getCounselingDetails();
  }

  ngOnInit(): void {
  }
  getCounselingDetails() {
    this.homeService.getCounselingList().subscribe((res: any) => {
      this.counselingData = res;
      debugger
      for (let i = 0; i < this.counselingData.length; i++) {
        this.counselingData[i].index = i + 1;
      }
      this.collectionSize = this.counselingData.length;
      this.getPagintaion();
    })
  }
  getPagintaion() {
    this.paginateData = this.counselingData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
}
