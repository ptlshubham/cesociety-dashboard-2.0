import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from 'src/app/core/services/company.service';

@Component({
  selector: 'app-daily-work-report',
  templateUrl: './daily-work-report.component.html',
  styleUrl: './daily-work-report.component.scss'
})
export class DailyWorkReportComponent {
  employeeList: any = [];
  selectedEmployeeIndex: number | null = null;
  dailyWork: any = [];
  page = 1;
  pageSize = 25;
  collectionSize = 0;
  paginateData: any = [];
  selectedDate: string = new Date().toISOString().split('T')[0];
  filteredDailyWork: any[] = [];

  constructor(
    private companyService: CompanyService,
    public toastr: ToastrService,
  ) {
    this.getAllEmployeeDetails();
    this.getAllDailyWork();
  }

  onDateChange(event: any) {
    this.selectedEmployeeIndex = null;
    this.getAllDailyWork();
  }
  getAllEmployeeDetails() {
    this.companyService.getAllEmployeeDetailsData().subscribe((res: any) => {
      this.employeeList = res;
      this.employeeList = res.filter((employee: any) => employee.role == 'Designer');
    });
  }
  getAllDailyWork() {
    this.companyService.getAllDailyList().subscribe((res: any) => {
      this.dailyWork = res.filter((item: any) => {
        const completeddate = new Date(item.completeddate).toISOString().split('T')[0]; // Convert completeddate to 'YYYY-MM-DD' format
        return completeddate === this.selectedDate; // Compare with selected date
      });

      for (let i = 0; i < this.dailyWork.length; i++) {
        this.dailyWork[i].index = i + 1;
      }

      this.collectionSize = this.dailyWork.length;
      this.filteredDailyWork = this.dailyWork;
      this.getPagination();
    });
  }

  getPagination() {
    this.paginateData = this.filteredDailyWork.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  selectEmployee(index: number, data: any) {
    this.selectedEmployeeIndex = index;
    this.filterDailyWorkByDesignerId(data.id);
  }

  filterDailyWorkByDesignerId(designerId: string) {
    this.filteredDailyWork = this.dailyWork.filter((item: any) => item.designerid === designerId);
    this.collectionSize = this.filteredDailyWork.length;
    this.getPagination();
  }
}
