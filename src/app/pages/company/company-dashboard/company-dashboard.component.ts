import { Component } from '@angular/core';
import { CompanyService } from 'src/app/core/services/company.service';

@Component({
  selector: 'app-company-dashboard',
  templateUrl: './company-dashboard.component.html',
  styleUrl: './company-dashboard.component.scss'
})
export class CompanyDashboardComponent {
  public employeeList: any = [];
  num: number = 0;
  option = {
    startVal: this.num,
    useEasing: true,
    duration: 2,
    // decimalPlaces: 2,
  };
  constructor(
    private companyService: CompanyService
  ) { }
  ngOnInit(): void {
    this.getStaffDetails();
  }
  getStaffDetails() {
    this.companyService.getAllEmployeeDetailsData().subscribe((res: any) => {
      this.employeeList = res;
    })
  }
}
