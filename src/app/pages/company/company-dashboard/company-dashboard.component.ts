import { Component } from '@angular/core';
import { CompanyService } from 'src/app/core/services/company.service';
import { ChartType } from './dashboard.model';

import { TokensService } from 'src/app/core/services/tokens.service';
import { donutChart, barChart, investedOverview } from './data';


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
  staffModel: any = {};
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
  donutChart: ChartType = {
    chart: { height: 320, type: "donut" },
    series: [44, 55, 41, 17, 15],
    labels: ["Series 1", "Series 2", "Series 3", "Series 4", "Series 5"],
    colors: ["#2ab57d", "#5156be", "#fd625e", "#4ba6ef", "#ffbf53"],
    legend: {
      show: !0,
      position: "bottom",
      horizontalAlign: "center",
      verticalAlign: "middle",
      floating: !1,
      fontSize: "14px",
      offsetX: 0,
    },
    responsive: [
      {
        breakpoint: 600,
        options: { chart: { height: 240 }, legend: { show: !1 } },
      },
    ],
  }
  barChart: ChartType = {
    chart: { height: 350, type: "bar", toolbar: { show: !1 } },
    plotOptions: { bar: { horizontal: !0 } },
    dataLabels: { enabled: !1 },
    series: [{ data: [380, 430, 450, 475, 550, 584, 780, 1100, 1220, 1365] }],
    colors: ['#2ab57d'],
    grid: { borderColor: "#f1f1f1" },
    xaxis: {
      categories: [],
    },
  };

  investedOverview: ChartType = {
    chart: {
      height: 270,
      type: 'radialBar',
      offsetY: -10
    },
    plotOptions: {
      radialBar: {
        startAngle: -130,
        endAngle: 130,
        dataLabels: {
          name: {
            show: false
          },
          value: {
            offsetY: 10,
            fontSize: '18px',
            color: undefined,
            formatter: function (val: any) {
              return val + "%";
            }
          }
        }
      }
    },
    colors: ['#5156be'],
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        gradientToColors: ['#34c38f'],
        shadeIntensity: 0.15,
        inverseColors: !1,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [20, 60],
      },
    },

    stroke: {
      dashArray: 4,
    },
    legend: {
      show: false
    },
    series: [80],
    labels: ['Series A'],
  };
  constructor(
    private companyService: CompanyService,
    public tokensService: TokensService,
  ) {

  }
  ngOnInit(): void {
    this.getAllEmployeeDetails();
    this.getAllToken();
    this.DashBoardTotals();
    this.GetEmployeeBar();
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
  GetEmployeeBar() {
    this.companyService.getAllEmployeeDetailsData().subscribe((res: any) => {
      res.forEach((employee: any) => {
        this.barChart.categories.push(employee.name);
      });
    });
  }
  getAllEmployeeDetails() {
    this.companyService.getAllEmployeeDetailsData().subscribe((res: any) => {
      this.employeeList = res;
      debugger
      this.staffModel.role = localStorage.getItem('Role')
    })
  }

}
