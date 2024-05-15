import { Component } from '@angular/core';
import { CompanyService } from 'src/app/core/services/company.service';
import { ChartType, } from './dashboard.model';
import { walletOverview } from './data';

@Component({
  selector: 'app-company-dashboard',
  templateUrl: './company-dashboard.component.html',
  styleUrl: './company-dashboard.component.scss'
})
export class CompanyDashboardComponent {
  public employeeList: any = [];
  public clientlist: any = []
  num: number = 0;
  option = {
    startVal: this.num,
    useEasing: true,
    duration: 2,
    // decimalPlaces: 2,
  };
  walletOverview!: ChartType;

  constructor(
    private companyService: CompanyService,

  ) { }
  ngOnInit(): void {
    this.fetchData();

    this.DashBoardTotals();
  }
  getStaffDetails() {
    this.companyService.getAllEmployeeDetailsData().subscribe((res: any) => {
      this.employeeList = res;
    })
  }
  getClientsDetails() {
    this.companyService.getAllClientDetailsData().subscribe((res: any) => {
      this.clientlist = res;
    })
  }
  DashBoardTotals() {
    this.getStaffDetails();
    this.getClientsDetails();
  }
  private fetchData() {
    this.walletOverview = walletOverview;

  }
}
