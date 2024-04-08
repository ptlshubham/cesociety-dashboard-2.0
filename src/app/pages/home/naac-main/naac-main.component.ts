import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/core/services/home.services';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Router } from '@angular/router';

@Component({
  selector: 'app-naac-main',
  templateUrl: './naac-main.component.html',
  styleUrls: ['./naac-main.component.scss']
})
export class NaacMainComponent implements OnInit {
  public Editor = ClassicEditor;
  paginateData: any = [];
  instituteId: any;
  validationForm!: FormGroup;
  NaacData: any = [];
  criteria = [
    { name: 'Criteria 1' },
    { name: 'Criteria 2' },
    { name: 'Criteria 3' },
    { name: 'Criteria 4' },
    { name: 'Criteria 5' },
    { name: 'Criteria 6' },
    { name: 'Criteria 7' },
    { name: 'SSR' },
    { name: 'AQAR' }
  ];
  selectedCriteria: any;
  isOpen: boolean = false;
  isUpdate: boolean = false;
  NAACDetailsModel: any = {};
  val: number = 0;
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  constructor(
    private homeService: HomeService,
    public toastr: ToastrService,
    public formBuilder: UntypedFormBuilder,
    private router: Router
  ) {
    this.instituteId = localStorage.getItem('InstituteId');
    this.criteria = [
      { name: 'Criteria 1' },
      { name: 'Criteria 2' },
      { name: 'Criteria 3' },
      { name: 'Criteria 4' },
      { name: 'Criteria 5' },
      { name: 'Criteria 6' },
      { name: 'Criteria 7' },
      { name: 'SSR' },
      { name: 'AQAR' }
    ]
    this.selectedCriteria = null;
  }
  get f() { return this.validationForm.controls; }
  ngOnInit(): void {
    this.getAllNAACDetails();
  }
  backToList() {
    this.isOpen = false;
    this.isUpdate = false;
    this.selectedCriteria = {};
    this.validationForm.markAsUntouched();
  }
  openAddNAACDetails() {
    this.isOpen = true;
    this.isUpdate = false;
    this.selectedCriteria = {};
    this.validationForm.markAsUntouched();

  }
  saveNAACDetails() {
    this.NAACDetailsModel;
    this.NAACDetailsModel.selectedCriteria = this.selectedCriteria;
    this.NAACDetailsModel.institute_id = this.instituteId;
    this.homeService.SaveNewNaacDetails(this.NAACDetailsModel).subscribe((res: any) => {
      if (res == 'success') {
        this.toastr.success('NAAC Details added Successfully.', 'Saved', { timeOut: 3000, });
        this.isOpen = false;
        this.isUpdate = false;
        this.getAllNAACDetails();
      }
    })
  }
  updateNaacDetails() {
    this.NAACDetailsModel;
    this.NAACDetailsModel.selectedCriteria = this.selectedCriteria;
    this.NAACDetailsModel.institute_id = this.instituteId;
    this.homeService.UpdateNewNaacDetails(this.NAACDetailsModel).subscribe((res: any) => {
      if (res == 'success') {
        this.toastr.success('NAAC Details Updated Successfully.', 'Saved', { timeOut: 3000, });
        this.isOpen = false;
        this.isUpdate = false;
        this.getAllNAACDetails();
      }
    })
  }
  getAllNAACDetails() {
    this.homeService.getNewNaacDetails(this.instituteId).subscribe((res: any) => {
      this.NaacData = res;
      for (let i = 0; i < this.NaacData.length; i++) {
        this.NaacData[i].index = i + 1;
      }
      this.collectionSize = this.NaacData.length;
      this.getPagintaion();
    })
  }

  onCriteriaChange(event: any) {
    this.selectedCriteria = event.name;
  }
  removeNaacDetails(id: any) {
    this.homeService.removeNewNaacById(id).subscribe((res: any) => {
      if (res == 'sucess') {
        this.toastr.success('NAAC Details deleted Successfully.', 'Removed', { timeOut: 3000, });
        this.getAllNAACDetails();
      }
    })
  }
  openNaacDetails(data: any) {
    this.isUpdate = true;
    this.isOpen = true;
    this.selectedCriteria = data.criteria;
    this.NAACDetailsModel.naacDetails = data.details;
    this.NAACDetailsModel.id = data.id;
  }
  getPlacementDataById() {
    // this.homeService.getPlacementDetails(localStorage.getItem('InstituteId')).subscribe((res: any) => {
    //   this.placementData = res;
    //   
    //   for (let i = 0; i < this.placementData.length; i++) {
    //     this.placementData[i].index = i + 1;
    //   }
    //   this.collectionSize = this.placementData.length;
    //   this.getPagintaion();
    // })
  }
  getPagintaion() {
    this.paginateData = this.NaacData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  viewNaacTable(id: any) {
    this.router.navigate(['/naac-view', id]);
  }
}
