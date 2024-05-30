import { Component } from '@angular/core';
import { CompanyService } from 'src/app/core/services/company.service';
import { ChartType } from './dashboard.model';

import { TokensService } from 'src/app/core/services/tokens.service';
import { forkJoin } from 'rxjs';

import { OwlOptions } from 'ngx-owl-carousel-o';
import { TodoList } from './data';


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
  employeeDataList: any = [];
  dailyWorkData: any = [];
  pendingStories: number = 0;
  completedStories: number = 0;
  pendingPosts: number = 0;
  completedPosts: number = 0;
  pendingReels: number = 0;
  complatedReel: number = 0;
  complatedStories: number = 0;
  complatedPosts: number = 0;
  completedReels: number = 0;
  extraPending: number = 0;
  extraComplated: number = 0;
  totalPending: number = 0;
  totalCompleted: number = 0;
  pendingExtraToken: any = 0;
  complatedExtraToken: any = 0;
  tokenDataForClient: any = []
  dailyWorkLength: number = 0;
  CESTotal: number = 0;
  totalPendingDailyWork: number = 0;
  TodoList: any;
  CancelToken: any = 0;
  totalComplatedDailyWork: number = 0;

  eid: any;
  title!: string;

  timelineCarousel: OwlOptions = {
    items: 1,
    loop: false,
    margin: 0,
    nav: false,
    navText: ["", ""],
    dots: true,
    responsive: {
      680: {
        items: 4
      },
    }
  }
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
              return Math.floor(val) + "%";
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
        inverseColors: false,
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
    series: [100],
    labels: ['Pending', 'Completed'],
  };


  barChart: ChartType = {
    chart: { height: 350, type: "bar", toolbar: { show: !1 } },
    plotOptions: { bar: { horizontal: !0 } },
    dataLabels: { enabled: !1 },
    series: [],
    colors: ['#fcbf49', '#2ab57d'],
    grid: { borderColor: "#f1f1f1" },
    xaxis: {
      categories: [],
    },
  };



  private fetchData() {
    this.TodoList = TodoList;

  }

  constructor(
    private companyService: CompanyService,
    public tokensService: TokensService,
  ) {

  }
  ngOnInit(): void {
    this.getAllTokens();
    this.fetchData()
    this.getBarDetails();
    this.getAllEmployeeDetails();
    this.getAllDailyWork();
    this.getClientsDetails()
    this.getAllTokenCompanyStatus();

  }

  getClientsDetails() {
    this.companyService.getAllClientDetailsData().subscribe((res: any) => {
      this.clientlist = res;
    })
  }




  getBarDetails() {
    debugger
    // Fetch employee details and daily work data
    forkJoin(
      this.companyService.getAllEmployeeDetailsData(),
      this.companyService.getAllDailyList()
    ).subscribe(([employeeRes, dailyWorkRes]: [any, any]) => {
      this.employeeList = employeeRes;

      // Filter employees with role "Designer" and map their IDs and names to an array
      const designers = this.employeeList
        .filter((employee: any) => employee.role === 'Designer')
        .map((employee: any) => ({ id: employee.id, name: employee.name }));

      const designerIds = designers.map((designer: any) => designer.id);

      // Initialize counts for total and completed works
      const designerDailyWorkCounts: { [key: string]: number } = {};
      const designerCompletedWorkCounts: { [key: string]: number } = {};
      debugger
      dailyWorkRes.forEach((work: any) => {
        if (designerIds.includes(work.designerid)) {
          if (!designerDailyWorkCounts[work.designerid]) {
            designerDailyWorkCounts[work.designerid] = 0;
            designerCompletedWorkCounts[work.designerid] = 0;
          }
          designerDailyWorkCounts[work.designerid]++;

          if (work.iscompleted) {
            designerCompletedWorkCounts[work.designerid]++;
          }
        }
      });
      debugger
      // Prepare series data based on designer daily work counts
      this.barChart.series = [
        {
          name: 'Total Work',
          data: designerIds.map((id: string) => designerDailyWorkCounts[id] || 0)
        },
        {
          name: 'Completed Work',
          data: designerIds.map((id: string) => designerCompletedWorkCounts[id] || 0)
        }
      ];
      debugger
      // Update x-axis categories with designer names
      this.barChart.xaxis.categories = designers.map((designer: any) => designer.name);
    });
  }


  changeStatusMail(event: Event, id: number): void {
    ;
    const isChecked = (event.target as HTMLInputElement).checked;
    let data = {
      id: id,
      iscompleted: isChecked
    };
    this.companyService.updateDailyById(data).subscribe((res: any) => {
      this.getBarDetails();
    });
  }
  getAllDailyWork() {
    this.companyService.getAllDailyList().subscribe((data: any) => {
      // Store all daily work data
      this.dailyWorkData = data;

      // Calculate the length of all daily work data
      this.dailyWorkLength = this.dailyWorkData.length;

      // Filter and count pending stories, posts, and reels
      const pendingStories = this.dailyWorkData.filter((item: any) => item.title === 'Story' && !item.iscompleted).length;
      const pendingPosts = this.dailyWorkData.filter((item: any) => item.title === 'Post' && !item.iscompleted).length;
      const pendingReels = this.dailyWorkData.filter((item: any) => item.title === 'Reel' && !item.iscompleted).length;
      const complatedStories = this.dailyWorkData.filter((item: any) => item.title === 'Story' && item.iscompleted).length;
      const complatedPosts = this.dailyWorkData.filter((item: any) => item.title === 'Post' && item.iscompleted).length;
      const complatedReel = this.dailyWorkData.filter((item: any) => item.title === 'Reel' && item.iscompleted).length;
      // Calculate the total number of pending tasks
      this.totalComplatedDailyWork = complatedStories + complatedPosts + complatedReel;
      this.totalPendingDailyWork = pendingStories + pendingPosts + pendingReels;

      // Optionally, log or process the totalPendingDailyWork as needed
      console.log(`Total Pending Daily Work: ${this.totalPendingDailyWork}`);

      // Continue with any additional logic, such as updating UI components
      this.getBarDetails();
    });
  }





  getAllTokens() {
    this.tokensService.getAllTokenData().subscribe((res: any) => {
      this.temparra = res;
      this.pendingDatatotal = res.filter((token: any) => token.status === 'Pending');
      this.processingDatatotal = res.filter((token: any) => token.status === 'Processing');
      this.completedDatatotal = res.filter((token: any) => token.status === 'Completed');

      this.CancelToken = res.filter((token: any) => token.status === 'Cancel');
      this.Tokens.series.push(this.pendingDatatotal.length, this.processingDatatotal.length, this.completedDatatotal.length, this.CancelToken.length);
      this.Tokens.labels.push('Pending', 'Processing', 'Completed');
    });
  }

  getAllTokenCompanyStatus() {
    if (this.SelectedClient) {
      this.tokensService.getAllTokenData().subscribe((res: any) => {
        // Filter token data based on selected client
        this.tokendata = res.filter((token: any) => token.clientid === this.SelectedClient.id);

        // Fetch daily work data and aggregate the required counts based on selected client
        this.getAllDailyWorks(this.SelectedClient.id);
      });
    }
  }

  getAllDailyWorks(clientId: number) {
    this.dailyWorkData = [];
    this.companyService.getAllDailyList().subscribe((data: any) => {
      // Filter daily work data based on selected client

      this.dailyWorkData = data.filter((element: any) => element.clientid === clientId);

      if (this.comapanyRole == 'Designer') {
        this.dailyWorkData = this.dailyWorkData.filter((element: any) => element.designerid == this.eid);
      }

      // Filter and count pending and completed stories, posts, reels, and extras
      this.pendingStories = this.dailyWorkData.filter((item: any) => item.title === 'Story' && !item.iscompleted).length;
      this.completedStories = this.dailyWorkData.filter((item: any) => item.title === 'Story' && item.iscompleted).length;

      this.pendingPosts = this.dailyWorkData.filter((item: any) => item.title === 'Post' && !item.iscompleted).length;
      this.completedPosts = this.dailyWorkData.filter((item: any) => item.title === 'Post' && item.iscompleted).length;

      this.pendingReels = this.dailyWorkData.filter((item: any) => item.title === 'Reel' && !item.iscompleted).length;
      this.completedReels = this.dailyWorkData.filter((item: any) => item.title === 'Reel' && item.iscompleted).length;

      // Aggregate total counts
      this.totalPending = this.pendingStories + this.pendingPosts + this.pendingReels
      this.totalCompleted = this.completedStories + this.completedPosts + this.completedReels

      const totalTasks = this.totalPending + this.totalCompleted;

      // Calculate completion percentage
      const completionPercentage = totalTasks > 0 ? Math.floor((this.totalCompleted / totalTasks) * 100) : 0;

      // Update the investedOverview series with the completion percentage for the individual client
      this.investedOverview.series = [completionPercentage];
      this.getAllToken(clientId);
    });
  }


  getAllToken(clientId: number) {
    this.tokensService.getAllTokenData().subscribe((res: any) => {
      this.tokenDataForClient = res.filter((token: any) => token.clientid === clientId);

      this.pendingExtraToken = this.tokenDataForClient.filter((token: any) => token.status === 'Pending').length;
      this.complatedExtraToken = this.tokenDataForClient.filter((token: any) => token.status === 'Completed').length;
    });
  }
  getAllEmployeeDetails() {
    this.companyService.getAllEmployeeDetailsData().subscribe((res: any) => {
      this.employeeList = res;
      this.staffModel.role = localStorage.getItem('Role')
    })
  }

  getAllClientDetails(id: any) {
    this.companyService.getClientDetailsById(id).subscribe((res: any) => {
      this.clientlist = res;
    })
  }




}
