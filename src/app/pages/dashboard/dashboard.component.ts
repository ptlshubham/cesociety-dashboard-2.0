import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/core/services/home.services';
import { StaffService } from 'src/app/core/services/staff.services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

/**
 *  Dashboard Component
 */

export class DashboardComponent implements OnInit {


  // bread crumb items
  breadCrumbItems!: Array<{}>;
  title!: string;

  departmentData: any = [];
  imagesData: any = [];
  newsData: any = [];
  staffData: any = [];
  contactData: any = [];
  infraData: any = [];
  blogsData: any = [];
  resultData:any=[];
  num: number = 0;

  option = {
    startVal: this.num,
    useEasing: true,
    duration: 2,
    // decimalPlaces: 2,
  };

  constructor(
    private homeService: HomeService,
    private staffService: StaffService
  ) {

  }


  ngOnInit(): void {
    /**
     * BreadCrumb 
     */
    this.breadCrumbItems = [
      { label: 'Dashboard' },
      { label: 'Dashboard', active: true }
    ];

    /**
     * Fetches the data
     */
    this.fetchData();
  }

  /**
   * Fetches the data
   */
  private fetchData() {
    this.getDepartmentDetails();
    this.getImagesDataById();
    this.getNewsDetails();
    this.getStaffDetails();
    this.getContactUsDetails();
    this.getInfraDataById();
    this.getBlogDetails();
    this.getResultDataById();
  }
  getDepartmentDetails() {
    this.homeService.getDepartmentDataById(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.departmentData = res;
    })
  }
  getImagesDataById() {
    this.homeService.getBannersImagesById(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.imagesData = res;
    })
  }
  getNewsDetails() {
    this.homeService.getNewsDataById(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.newsData = res;
    })
  }
  getStaffDetails() {
    this.staffService.getAllStaffDetailsData(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.staffData = res;

    })
  }
  getContactUsDetails() {
    this.homeService.getContactUsDetails(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.contactData = res;
    })
  }
  getInfraDataById() {
    this.homeService.getImfraDetails(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.infraData = res;
    })
  }
  getBlogDetails() {
    this.homeService.getBlogsById(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.blogsData = res;
    })
  }
  getResultDataById() {
    this.homeService.getResultDetailsById(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.resultData = res;
    })
  }
}
