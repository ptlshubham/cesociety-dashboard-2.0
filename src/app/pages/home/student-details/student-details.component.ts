import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/core/services/home.services';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.scss']
})
export class StudentDetailsComponent implements OnInit {
  validationForm!: FormGroup;
  submitted = false;

  studentList: any = [];
  studentModel: any = {};
  studentDetails: any = {};
  public Editor = ClassicEditor;
  isOpen: boolean = false;
  isAdd: boolean = false;
  isUpdate: boolean = false;
  isOpenDetails: boolean = false;

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];

  constructor(
    private homeService: HomeService,
    public toastr: ToastrService,
    public formBuilder: UntypedFormBuilder,


  ) { }

  ngOnInit(): void {
    this.getStudentListDetails();
    this.isOpen = true;
    this.validationForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      details:['', [Validators.required]],
    });
  }
  get f() { return this.validationForm.controls; }

  openDetails() {
    this.isOpen = false;
    this.isOpenDetails = false;
    this.isAdd = true;

  }
  closeDetails() {
    this.isOpen = true;
    this.isOpenDetails = false;
    this.isAdd = false;

  }
  getStudentListDetails() {
    this.homeService.getStudentList(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.studentList = res;
      for (let i = 0; i < this.studentList.length; i++) {
        this.studentList[i].index = i + 1;
      }
      this.collectionSize = this.studentList.length;
      this.getPagintaion();
    })
  }
  getPagintaion() {
    this.paginateData = this.studentList
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  saveStudentDetails() {
    this.submitted = true;
    if (this.validationForm.invalid) {
      return;
    } else {
      this.studentModel.institute_id = localStorage.getItem('InstituteId');
      this.homeService.saveStudentDetails(this.studentModel).subscribe((res: any) => {
        this.toastr.success('Student Details added successfully', 'Success', {
          timeOut: 3000,
        });
        this.studentModel = {};
        this.validationForm.markAsUntouched();
        this.isOpen = true;
        this.isOpenDetails = false;
        this.isAdd = false;
        this.getStudentListDetails();
      })
    }


  }
  removeStudentListDetails(id: any) {
    this.homeService.removeStudentList(id).subscribe((res: any) => {
      this.studentList = res;
      this.toastr.success('Student list deleted successfully', 'Removed', {
        timeOut: 3000,
      });
      this.getStudentListDetails();
    })
  }
  viewOpenDetails(data: any) {
    this.studentDetails = data;
    this.isOpen = false;
    this.isOpenDetails = true;
    this.isUpdate = false;
  }
  closeStudDetails() {
    this.isOpen = true;
    this.isOpenDetails = false;
    this.isAdd = false;

  }
  editStudentlist(data: any) {
    this.studentModel = data;
    this.isAdd = true;
    this.isOpen = false;
    this.isOpenDetails = false;
    this.isUpdate = true;

  }
  updateStudentDetails() {
    this.homeService.updateStudentDetails(this.studentModel).subscribe((res: any) => {
      this.toastr.success('Student Details updated successfully', 'Updated', {
        timeOut: 3000,
      });
      this.isOpen = true;
      this.isOpenDetails = false;
      this.isAdd = false;
      this.isUpdate = false;
      this.getStudentListDetails();
    })
  }
}
