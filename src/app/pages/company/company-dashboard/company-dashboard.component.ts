import { Component } from '@angular/core';
import { CompanyService } from 'src/app/core/services/company.service';
import { ChartType, } from './dashboard.model';

import { TokensService } from 'src/app/core/services/tokens.service';


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
  pendingData: any = [];
  processingData: any = [];
  reviewData: any = [];
  changesData: any = [];
  completedData: any = [];
  cancelData: any = [];
  Tokens: ChartType = {
    chart: {
      width: 227,
      height: 227,
      type: 'pie'
    },
    colors: ["#777aca", "#5156be", "#a8aada"],
    legend: { show: false },
    stroke: {
      width: 0
    },
    series: [],
    labels: [],
  };


  constructor(
    private companyService: CompanyService,
    public tokensService: TokensService,
  ) {

  }
  ngOnInit(): void {
    this.getAllToken();
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
  getAllToken() {
    this.tokensService.getAllTokenData().subscribe((res: any) => {
      this.pendingData = res.filter((token: any) => token.status === 'Pending');
      this.processingData = res.filter((token: any) => token.status === 'Processing');
      this.completedData = res.filter((token: any) => token.status === 'Completed');
      this.Tokens.series.push(this.pendingData.length, this.processingData.length, this.completedData.length);
      this.Tokens.labels.push('Pending', 'Processing', 'Completed');
      debugger;
    });
  }
}
