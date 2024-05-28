import { Component } from '@angular/core';
import { CompanyService } from 'src/app/core/services/company.service';
import { ChartType } from './dashboard.model';

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
  tokendata: any = []
  pendingData: any = [];
  pendingDatatotal: any = []
  processingDatatotal: any = []
  processingData: any = [];
  completedDatatotal: any = []
  reviewData: any = [];
  temparra: any = []
  changesData: any = [];
  completedData: any = [];
  cancelData: any = [];
  staffModel: any = {};
  employeeDataList: any = []
  SelectedClient = this.tokendata.clientname;
  comapanyRole: any = localStorage.getItem('Role');
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
    series: [{ data: [380, 430, 450, 475, 550, 584, 780, 1100, 1220, 1365, 345, 345, 34, 45] }],
    colors: ['#2ab57d'],
    grid: { borderColor: "#f1f1f1" },
    xaxis: {
      categories: [],
    },
  };


  constructor(
    private companyService: CompanyService,
    public tokensService: TokensService,
  ) {

  }
  ngOnInit(): void {
    this.getAllTokens();
    this.getBarDetails();
    this.getAllEmployeeDetails();

    this.getClientsDetails()
    this.getAllTokenCompanyStatus()
  }

  getClientsDetails() {
    this.companyService.getAllClientDetailsData().subscribe((res: any) => {
      this.clientlist = res;
    })
  }
  getBarDetails() {
    this.companyService.getAllEmployeeDetailsData().subscribe((res: any) => {
      this.employeeList = res;
      // Filter employees with role "designer" and map their names to categories array
      this.barChart.xaxis.categories = this.employeeList
        .filter((employee: any) => employee.role === 'Designer')
        .map((employee: any) => employee.name);
    });
  }


  getAllTokens() {
    debugger
    this.tokensService.getAllTokenData().subscribe((res: any) => {
      this.temparra = res;
      this.pendingDatatotal = res.filter((token: any) => token.status === 'Pending');
      this.processingDatatotal = res.filter((token: any) => token.status === 'Processing');
      this.completedDatatotal = res.filter((token: any) => token.status === 'Completed');
      this.Tokens.series.push(this.pendingDatatotal.length, this.processingDatatotal.length, this.completedDatatotal.length);
      this.Tokens.labels.push('Pending', 'Processing', 'Completed');
      debugger;
    });
  }

  getAllTokenCompanyStatus() {
    debugger;
    if (this.SelectedClient) {
      this.tokensService.getAllTokenData().subscribe((res: any) => {
        // Filter token data based on selected client
        this.tokendata = res.filter((token: any) => token.clientid === this.SelectedClient.id);

        // Filter data for different statuses
        this.pendingData = this.tokendata.filter((token: any) => token.status === 'Pending');
        this.completedData = this.tokendata.filter((token: any) => token.status === 'Completed');

        // Calculate total tokens
        const totalTokens = this.tokendata.length;

        // Calculate completion percentage
        const completionPercentage = (this.completedData.length / totalTokens) * 100;

        // Update chart data
        this.investedOverview.series = [
          this.pendingData.length,
          this.tokendata.length - this.pendingData.length - this.completedData.length,
          completionPercentage
        ];
        this.investedOverview.labels = ['Pending', 'Processing', 'Completed'];
      });
    }
  }

  getAllEmployeeDetails() {
    this.companyService.getAllEmployeeDetailsData().subscribe((res: any) => {
      this.employeeList = res;
      debugger
      this.staffModel.role = localStorage.getItem('Role')
    })
  }

  getAllClientDetails(id: any) {
    this.companyService.getClientDetailsById(id).subscribe((res: any) => {
      this.clientlist = res;
    })
  }

}
