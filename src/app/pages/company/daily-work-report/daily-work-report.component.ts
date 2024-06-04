import { Component } from '@angular/core';
import { UntypedFormBuilder, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from 'src/app/core/services/company.service';

@Component({
  selector: 'app-daily-work-report',
  templateUrl: './daily-work-report.component.html',
  styleUrl: './daily-work-report.component.scss'
})
export class DailyWorkReportComponent {
  employeeList: any = [];
  constructor(
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder,
    private companyService: CompanyService,
    public toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.getAllEmployeeDetails();
  }
  getAllEmployeeDetails() {
    this.companyService.getAllEmployeeDetailsData().subscribe((res: any) => {
      this.employeeList = res;
      this.employeeList = res.filter((employee: any) => employee.role == 'Designer');
    });
  }

}
