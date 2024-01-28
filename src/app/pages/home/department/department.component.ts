import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/core/services/home.services';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {
  validationForm!: FormGroup;
  submitted = false;

  departmentModel: any = {};
  updateDepartmentModel: any = {};
  departmentData: any = [];

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];

  constructor(
    public formBuilder: FormBuilder,
    private homeService: HomeService,
    private modalService: NgbModal,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getDepartmentDetails();
    this.validationForm = this.formBuilder.group({
      department: ['', [Validators.required]],
    });
  }
  get f() { return this.validationForm.controls; }
  saveDepartmentList() {
    this.submitted = true;
    if (this.validationForm.invalid) {
      return;
    } else {
      this.departmentModel.institute_id = localStorage.getItem('InstituteId');
      this.homeService.saveDepartmentListData(this.departmentModel).subscribe((res: any) => {
        this.toastr.success('Department added Successfully', 'success', {
          timeOut: 3000,
        });
        this.departmentModel = {};
        this.validationForm.markAsUntouched();
        this.getDepartmentDetails();
      })
    }
  }
  getDepartmentDetails() {
    this.homeService.getDepartmentDataById(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.departmentData = res;

      for (let i = 0; i < this.departmentData.length; i++) {
        this.departmentData[i].index = i + 1;
      }
      this.collectionSize = this.departmentData.length;
      this.getPagintaion();
    })
  }
  getPagintaion() {
    this.paginateData = this.departmentData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);

  }
  editDepartmentDetails(smallDataModal: any, data: any) {
    this.modalService.open(smallDataModal, { size: 'sm', windowClass: 'modal-holder', centered: true });
    this.updateDepartmentModel = data;
    this.getDepartmentDetails();

  }
  updateDepartmentDetails() {
    this.homeService.updateDepartmentListData(this.updateDepartmentModel).subscribe((res: any) => {
      if (res == 'success') {
        this.toastr.success('Department Updated Successfully', 'success', {
          timeOut: 3000,
        });
        location.reload();
      }
    })
  }
  removeDepartmentdata(id: any) {
    this.homeService.removeDepartmentDataById(id).subscribe((res: any) => {
      this.departmentData = res;
      this.toastr.success('Department removed Successfully', 'success', {
        timeOut: 3000,
      });
      this.getDepartmentDetails();
    })
  }

}
