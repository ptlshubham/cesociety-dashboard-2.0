import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/core/services/home.services';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {
  contactData: any = [];

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];
  constructor(
    private homeService: HomeService
  ) {
    this.getContactUsDetails();
   }

  ngOnInit(): void {
  }
  getContactUsDetails() {
    this.homeService.getContactUsDetails(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.contactData = res;
      for (let i = 0; i < this.contactData.length; i++) {
        this.contactData[i].index = i + 1;
      }
      this.collectionSize = this.contactData.length;
      this.getPagintaion();
    })
  }
  getPagintaion() {
    this.paginateData = this.contactData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
}
