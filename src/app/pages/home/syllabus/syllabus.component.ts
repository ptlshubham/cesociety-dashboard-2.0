import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/core/services/home.services';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';


@Component({
  selector: 'app-syllabus',
  templateUrl: './syllabus.component.html',
  styleUrls: ['./syllabus.component.scss']
})
export class SyllabusComponent implements OnInit {

  public Editor = ClassicEditor;
  syllabusData: any = [];
  syllabusModel: any = {};
  isOpen: boolean = false;
  isUpdate: boolean = false;
  val: number = 0;
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];
  constructor(
    private homeService: HomeService,
    private router: Router,
    public toastr: ToastrService,

  ) { }

  ngOnInit(): void {
    this.val++;
    this.getSyllabusDataById();
  }
  openAddRes() {
    this.syllabusModel = {};
    this.isOpen = true;
    this.isUpdate = false;

  }
  closeAddRes() {
    this.isOpen = false;
    this.isUpdate = false;
  }
  saveSyllabusDetails() {
    this.syllabusModel.institute_id = localStorage.getItem('InstituteId');
    this.homeService.saveSyllabusDetails(this.syllabusModel).subscribe((res: any) => {
      this.syllabusData = res;
      this.toastr.success('Syllabus Details added Successfully.', 'Saved', { timeOut: 3000, });
      this.isUpdate = false;
      this.isOpen = false;
      this.getSyllabusDataById();
    })
  }
 
  editSyllabusDetails(data: any) {
    this.syllabusModel = data;
    // this.getResearchMultiImage(data.id);
    this.isOpen = true;
    this.isUpdate = true;
  }
  updateSyllabusDetails() {
    this.homeService.updateSyllabusDetails(this.syllabusModel).subscribe((res: any) => {
      this.syllabusData = res;
      this.toastr.success('Syllabus Details Updated Successfully.', 'Updated', { timeOut: 3000, });
      this.getSyllabusDataById();
      this.isOpen = false;
      this.isUpdate = false;
    })
  }
  removeSyllabusById(id: any) {
    this.homeService.removeSyllabusById(id).subscribe((res: any) => {
      this.syllabusData = res;
      this.toastr.success('Syllabus Details deleted Successfully.', 'Removed', { timeOut: 3000, });
      this.getSyllabusDataById();
    })
  }
  getSyllabusDataById() {
    this.homeService.getSyllabusDetails(localStorage.getItem('InstituteId')).subscribe((res: any) => {
      this.syllabusData = res;
      for (let i = 0; i < this.syllabusData.length; i++) {
        this.syllabusData[i].index = i + 1;
      }
      this.collectionSize = this.syllabusData.length;
      this.getPagintaion();
    })
  }
  getPagintaion() {
    this.paginateData = this.syllabusData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  viewSyllabusDetails(id: any) {
    this.router.navigate(['/syllabus-details', id]);
  }

}
